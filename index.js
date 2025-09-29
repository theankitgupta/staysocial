import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from './src/app.js';

dotenv.config();

// Fail-fast DB connect
await connectDB();
console.log("Connecting to MongoDB URI:", process.env.MONGODB_URI);

const PORT = process.env.PORT || 2403;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});