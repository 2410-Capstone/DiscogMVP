require('dotenv').config();
const app = require('./API'); // API.js already creates and configures the app

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
