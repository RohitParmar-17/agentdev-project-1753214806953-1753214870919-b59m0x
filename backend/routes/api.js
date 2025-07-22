const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.get('/items', async (req, res) => {
    try {

      const items = await getItemsFromDatabase();
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve items' });
    }
});

router.post('/items',
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newItem = {
        name: req.body.name,
        description: req.body.description
      };

      const createdItem = await createItemInDatabase(newItem); //Replace with your database function
      res.status(201).json(createdItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create item' });
    }
});

router.put('/items/:id',
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const itemId = req.params.id;
    const updatedItem = {
        name: req.body.name,
        description: req.body.description,
    };
    try {

      const updated = await updateItemInDatabase(itemId, updatedItem); //Replace with your database function
      if (!updated) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(updatedItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update item' });
    }
});

router.delete('/items/:id', async (req, res) => {
    const itemId = req.params.id;
    try {

      const deleted = await deleteItemFromDatabase(itemId); //Replace with your database function
      if (!deleted) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete item' });
    }
});

// Placeholder database functions - REPLACE THESE
const getItemsFromDatabase = async () => {
    return [{id:1, name:"Item 1", description: "Description 1"}, {id:2, name:"Item 2", description: "Description 2"}];
};

const createItemInDatabase = async (item) => {
    return {...item, id:3};
};

const updateItemInDatabase = async (id, item) => {
    return item;
};

const deleteItemFromDatabase = async (id) => {
    return true;
};

module.exports = router;
