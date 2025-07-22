const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createError } = require('http-errors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.get('/api/data', async (req, res, next) => {
    try {

        const data = { message: 'Hello from the API!' };
        res.json(data);
    } catch (error) {
        next(error);
    }
});

app.post('/api/data', async (req, res, next) => {
    try {

        const newData = req.body;
        //Replace with your database insertion or other logic.
        console.log("Received:", newData);
        res.status(201).json({ message: 'Data received successfully!' });
    } catch (error) {
        next(error);
    }
});

//Error Handling Middleware
app.use((req, res, next) => {
    next(createError(404, 'Not Found'));
});

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    console.error(err);
    res.status(statusCode).json({ error: message });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
