import 'module-alias/register.js';
import * as dotenv from 'dotenv'
dotenv.config()

import app from './server.mjs';
// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
