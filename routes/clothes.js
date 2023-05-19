const express = require('express');
const router = express.Router();
const { db } = require('../config/config');

router.get('/', async (req, res) => {
    try {
        const clothesSnapshot = await db.collection('clothes').get();
        const clothes = clothesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.json(clothes);
    } catch (error) {
        console.error('Error fetching clothes:', error);
        res.status(500).json({ error: 'Failed to fetch clothes' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('clothes').doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Clothing item not found' });
        }

        const clothingItem = {
            id: doc.id,
            ...doc.data(),
        };

        res.json(clothingItem);
    } catch (error) {
        console.error('Error fetching clothing item:', error);
        res.status(500).json({ error: 'Failed to fetch clothing item' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCloth = req.body;
        const docRef = await db.collection('clothes').add(newCloth);

        const createdClothingItem = {
            id: docRef.id,
            ...newCloth,
        };

        res.json(createdClothingItem);
    } catch (error) {
        console.error('Error creating clothing item:', error);
        res.status(500).json({ error: 'Failed to create clothing item' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCloth = req.body;

        const docRef = db.collection('clothes').doc(id);
        await docRef.update(updatedCloth);

        const updatedClothingItem = {
            id,
            ...updatedCloth,
        };

        res.json(updatedClothingItem);
    } catch (error) {
        console.error('Error updating clothing item:', error);
        res.status(500).json({ error: 'Failed to update clothing item' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await db.collection('clothes').doc(id).delete();

        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting clothing item:', error);
        res.status(500).json({ error: 'Failed to delete clothing item' });
    }
});

module.exports = router;
