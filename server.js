const express = require('express');
const app = express();
const PORT = 3001;
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes')
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
