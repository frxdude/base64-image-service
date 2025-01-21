const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const IMAGE_DIR = path.join(__dirname, 'files');

app.get('/image-to-base64', async (req, res) => {
  const fileName = req.query.fileName;

  if (!fileName) {
    return res.status(400).send({ error: 'File name is required' });
  }

  try {
    const files = fs.readdirSync(IMAGE_DIR);
    const matchingFile = files.find((file) => path.parse(file).name === fileName);

    if (!matchingFile) {
      return res.status(404).send({ error: 'Image not found' });
    }

    const filePath = path.join(IMAGE_DIR, matchingFile);

    const fileBuffer = fs.readFileSync(filePath);

    const base64Image = fileBuffer.toString('base64');

    const ext = path.extname(matchingFile).toLowerCase();
    const mimeType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
    }[ext] || 'application/octet-stream';

    res.send({
      fileName: matchingFile,
      contentType: mimeType,
      base64: `data:${mimeType};base64,${base64Image}`,
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send({ error: 'Failed to retrieve the image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});