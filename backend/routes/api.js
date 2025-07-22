const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Sample Data (Replace with database interaction)
let items = [];

// GET all items
router.get('/', (req, res) => {
    res.json(items);
});

// POST a new item
router.post('/', [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const newItem = {
        id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
        name: req.body.name,
        description: req.body.description
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// GET a specific item
router.get('/:id', (req, res) => {
    const item = items.find(item => item.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
});

// PUT (update) a specific item
router.put('/:id', [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const itemId = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found' });
    }
    items[itemIndex] = { ...items[itemIndex], ...req.body };
    res.json(items[itemIndex]);
});

// DELETE a specific item
router.delete('/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found' });
    }
    items.splice(itemIndex, 1);
    res.status(204).send();
});

module.exports = router;
