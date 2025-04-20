const AWS = require('aws-sdk');
const polly = new AWS.Polly({ region: process.env.AWS_REGION });

module.exports = {
  async synthesizeSpeech(text, voice) {
    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: voice || 'Joanna'
    };
    const data = await polly.synthesizeSpeech(params).promise();
    return data.AudioStream;
  }
};
