const express = require('express');
const router = express.Router();
const { db } = require('../config/config');

router.get('/', async (req, res) => {
    try {
        const yfusSnapshot = await db.collection('yfus').get();
        const yfus = yfusSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.json(yfus);
    } catch (error) {
        console.error('Error fetching clothes:', error);
        res.status(500).json({ error: 'Failed to fetch clothes' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('yfus').doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Yfu not found' });
        }

        const yfu = {
            id: doc.id,
            ...doc.data(),
        };

        res.json(yfu);
    } catch (error) {
        console.error('Error fetching Yfu:', error);
        res.status(500).json({ error: 'Failed to fetch Yfu' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newYfu = req.body;
        const docRef = await db.collection('yfus').add(newYfu);

        const createdYfu = {
            id: docRef.id,
            ...newYfu,
        };

        res.json(createdYfu);
    } catch (error) {
        console.error('Error creating Yfu:', error);
        res.status(500).json({ error: 'Failed to create Yfu' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedYfu = req.body;

        const docRef = db.collection('yfus').doc(id);
        await docRef.update(updatedYfu);

        const updatedYfuItem = {
            id,
            ...updatedYfu,
        };

        res.json(updatedYfuItem);
    } catch (error) {
        console.error('Error updating Yfu:', error);
        res.status(500).json({ error: 'Failed to update Yfu' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await db.collection('yfus').doc(id).delete();

        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting yfu:', error);
        res.status(500).json({ error: 'Failed to delete yfu' });
    }
});

module.exports = router;
