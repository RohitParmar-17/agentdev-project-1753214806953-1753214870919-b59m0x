const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());

//Simulate database interaction (replace with actual database connection)

const data = {};

app.get('/api/data/:id?', (req, res) => {
    const id = req.params.id;
    try{
        if(id){
            if(!data[id]){
                return res.status(404).json({error: "Data not found"});
            }
            return res.json(data[id]);
        }
        return res.json(data);
    } catch(error){
        console.error("Error fetching data:", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

app.post('/api/data', (req, res) => {
    try{
        const newEntry = {...req.body, id: uuidv4()};
        data[newEntry.id] = newEntry;
        res.status(201).json(newEntry);
    } catch(error){
        console.error("Error creating data:", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

app.put('/api/data/:id', (req, res) => {
    const id = req.params.id;
    try{
        if(!data[id]){
            return res.status(404).json({error: "Data not found"});
        }
        data[id] = {...data[id], ...req.body};
        res.json(data[id]);
    } catch(error){
        console.error("Error updating data:", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

app.delete('/api/data/:id', (req, res) => {
    const id = req.params.id;
    try{
        if(!data[id]){
            return res.status(404).json({error: "Data not found"});
        }
        delete data[id];
        res.status(204).send();
    } catch(error){
        console.error("Error deleting data:", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: "Internal Server Error"});
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
