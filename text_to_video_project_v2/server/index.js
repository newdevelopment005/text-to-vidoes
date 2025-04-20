require('dotenv').config();
const express = require('express');
const videoRoutes = require('./routes/video');
const app = express();

app.use(express.json());
app.use('/api/video', videoRoutes);
app.use('/videos', express.static('videos'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
