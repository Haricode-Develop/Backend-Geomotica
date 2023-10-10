const express = require('express');
const app = express();
const PORT = 3001;

const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
