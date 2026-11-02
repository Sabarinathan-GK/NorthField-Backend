const dotenv = require('dotenv');
dotenv.config();

const app = require("./app");

const connectDB = require('./config/db');
const { seedDatabase }  = require('./config/seed');

const PORT = process.env.PORT;

try {
  connectDB();
  seedDatabase();
  app.listen(PORT, () => console.log(`Northfield API listening on http://localhost:${PORT}`));
} catch (error) {
  console.error("Could not start the Northfield API:", error);
  process.exitCode = 1;
}




