import express from 'express';
import 'dotenv/config'; // Loads .env variables into process.env

const app = express();
const PORT = process.env.PORT || 3000; // Use port from .env, or 3000 as a fallback

app.get('/', (req, res) => {
  res.send('Welcome to Staybnb!');
});

export default app;