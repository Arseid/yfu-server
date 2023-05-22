const express = require('express');
const router = express.Router();
const { db } = require('../config/config');

// Get the list of admins
router.get('/', async (req, res) => {
    try {
        const doc = await db.collection('users_roles').doc('DhgKYUFuUiuJK2LgOJn8').get();
        if (!doc.exists) {
            res.status(404).json({ error: 'Admins not found' });
        } else {
            res.json({ admins: doc.data().isAdmin });
        }
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
});

// Add an admin
router.post('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const docRef = db.collection('users_roles').doc('DhgKYUFuUiuJK2LgOJn8');
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Admins not found' });
        }

        let admins = doc.data().isAdmin;
        if (admins.includes(userId)) {
            return res.status(400).json({ error: 'User is already an admin' });
        }

        admins.push(userId);
        await docRef.update({ isAdmin: admins });
        res.sendStatus(200);

    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).json({ error: 'Failed to add admin' });
    }
});

// Remove an admin
router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const docRef = db.collection('users_roles').doc('DhgKYUFuUiuJK2LgOJn8');
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Admins not found' });
        }

        let admins = doc.data().isAdmin;
        if (!admins.includes(userId)) {
            return res.status(400).json({ error: 'User is not an admin' });
        }

        admins = admins.filter((adminId) => adminId !== userId);
        await docRef.update({ isAdmin: admins });
        res.sendStatus(200);

    } catch (error) {
        console.error('Error removing admin:', error);
        res.status(500).json({ error: 'Failed to remove admin' });
    }
});

module.exports = router;
