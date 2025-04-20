const axios = require('axios');

module.exports = {
  async generateVideoFromText(text, domainPreset) {
    const resp = await axios.post('https://api.stability.ai/v1/video/text2video', {
      text_prompt: text,
      duration_seconds: 10,
      resolution: "720p",
      preset: domainPreset
    }, {
      headers: { Authorization: `Bearer ${process.env.STABILITY_KEY}` }
    });
    return resp.data.video_url;
  },

  async generateImageToVideo(avatarImageUrl) {
    const resp = await axios.post('https://api.stability.ai/v1/video/image2video', {
      image_url: avatarImageUrl,
      duration_seconds: 10,
      resolution: "720p"
    }, {
      headers: { Authorization: `Bearer ${process.env.STABILITY_KEY}` }
    });
    return resp.data.video_url;
  }
};
