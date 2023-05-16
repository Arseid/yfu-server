const express = require('express');
const router = express.Router();
const db = require('../config/config');

router.get('/', async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = usersSnapshot.docs.map(doc => doc.data());
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newUser = req.body;
        const docRef = await db.collection('users').add(newUser);
        res.status(201).json({ id: docRef.id });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('users').doc(id).get();
        if (!doc.exists) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ id: doc.id, ...doc.data() });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = req.body;
        await db.collection('users').doc(id).update(updatedUser);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('users').doc(id).delete();
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;