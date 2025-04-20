const express = require('express');
const { v4: uuid } = require('uuid');
const videoQueue = require('../queue');
const router = express.Router();

// Accepts: text, avatarImage (url), domainPreset, ttsVoice
router.post('/', async (req, res) => {
  const { text, avatarImage, domainPreset, ttsVoice } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  const jobId = uuid();
  const jobData = { text, avatarImage, domainPreset, ttsVoice, jobId };
  const job = await videoQueue.add(jobData);
  res.json({ jobId, statusEndpoint: `/status/${job.id}` });
});

router.get('/status/:id', async (req, res) => {
  const job = await videoQueue.getJob(req.params.id);
  if (!job) return res.status(404).end();
  const state = await job.getState();
  const progress = job._progress;
  const result = job.returnvalue || null;
  res.json({ state, progress, result });
});

module.exports = router;
