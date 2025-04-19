
const express = require('express');
const cors = require('cors');
const api = require('./API'); 

require('dotenv').config();


const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173', 
    'http://localhost:4242'  
  ],
  credentials: true
}));

app.use('/api', api);  
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
