const express = require('express');
const cors = require('cors');
const path = require('path');
const { performAnalysis } = require('./resumeAnalysis');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/analyze', (req, res) => {
  const { jobTitle, resumeText, experienceLevel } = req.body;
  if (!jobTitle || !resumeText) {
    return res.status(400).json({ error: 'jobTitle and resumeText are required' });
  }

  try {
    const analysis = performAnalysis(jobTitle, resumeText, experienceLevel);
    return res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Resume Analyzer API listening on http://localhost:3000/api/analyze`);
});
