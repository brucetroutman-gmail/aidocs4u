import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.mjs';
import pageRoutes from './routes/pages.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

app.use('/api/auth', authRoutes);
app.use('/', pageRoutes);

app.listen(PORT, () => {
  console.log(`AIDocs4U server running on port ${PORT}`);
});