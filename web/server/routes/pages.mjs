import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/index.html'));
});

router.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/auth.html'));
});

router.get('/download', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/download.html'));
});

export default router;