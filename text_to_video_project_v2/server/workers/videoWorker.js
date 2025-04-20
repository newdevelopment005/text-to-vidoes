const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const aiClient = require('../utils/aiClient');
const ttsClient = require('../utils/ttsClient');
const videoQueue = require('../queue');
const fs = require('fs');
const path = require('path');

videoQueue.process(async (job) => {
  const { text, avatarImage, domainPreset, ttsVoice, jobId } = job.data;
  // update progress: 10%
  job.progress(10);
  // generate main video
  let videoUrl = await aiClient.generateVideoFromText(text, domainPreset);
  // optionally overlay avatar-based video
  if (avatarImage) {
    job.progress(30);
    const avatarVideo = await aiClient.generateImageToVideo(avatarImage);
    videoUrl = avatarVideo;
  }
  // download final raw video
  const rawPath = path.join('videos', `${jobId}_raw.mp4`);
  await new Promise((res, rej) => {
    ffmpeg(videoUrl)
      .save(rawPath)
      .on('end', res)
      .on('error', rej);
  });
  job.progress(60);
  // generate speech
  const audioStream = await ttsClient.synthesizeSpeech(text, ttsVoice);
  const audioPath = path.join('videos', `${jobId}.mp3`);
  fs.writeFileSync(audioPath, audioStream);
  job.progress(80);
  // merge audio + video
  const outputPath = path.join('videos', `${jobId}.mp4`);
  await new Promise((res, rej) => {
    ffmpeg()
      .addInput(rawPath)
      .addInput(audioPath)
      .videoCodec('copy')
      .audioCodec('aac')
      .save(outputPath)
      .on('end', res)
      .on('error', rej);
  });
  job.progress(100);
  return { outputPath };
});
