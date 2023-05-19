const express = require('express');
const router = express.Router();
const {db, admin} = require('../config/config');

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

        // Fetch the last used user_id in the collection 'counters' if none than set it to 700000000
        const counterDoc = await db.collection('counters').doc('user_id').get();
        const counterData = counterDoc.data();
        const lastUserId = counterData ? counterData["value"] : 700000000;

        // Increment user_id
        const newUserId = lastUserId + 1;
        newUser["user_id"] = newUserId;

        // Update the counter
        await db.collection('counters').doc('user_id').set({ value: newUserId });

        // Create the new user document with the same id as the auth user's uid
        await db.collection('users').doc(newUser["id"]).set(newUser);

        res.status(201).json({ id: newUser.id });
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

        // Delete user from Firestore
        await db.collection('users').doc(id).delete();

        // Delete user from Firebase Authentication
        await admin.auth().deleteUser(id);

        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Add a clothing item to the user's clothes array
router.post('/:userId/clothes/:clothingId', async (req, res) => {
    try {
        const { userId, clothingId } = req.params;

        const userDocRef = db.collection('users').doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the clothing item already exists in the user's clothes array
        const userClothes = userDoc.data().clothes || [];
        if (userClothes.includes(clothingId)) {
            return res.status(400).json({ error: 'Clothing item already exists in user\'s clothes' });
        }

        // Add the clothingId to the clothes array
        userClothes.push(clothingId);

        // Update the user document with the updated clothes array
        await userDocRef.update({ clothes: userClothes });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error adding clothing item to user:', error);
        res.status(500).json({ error: 'Failed to add clothing item to user' });
    }
});

// Remove a clothing item from the user's clothes array
router.delete('/:userId/clothes/:clothingId', async (req, res) => {
    try {
        const { userId, clothingId } = req.params;

        const userDocRef = db.collection('users').doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove the clothingId from the clothes array
        let userClothes = userDoc.data().clothes || [];
        userClothes = userClothes.filter((clothing) => clothing !== clothingId);

        // Update the user document with the updated clothes array
        await userDocRef.update({ clothes: userClothes });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error removing clothing item from user:', error);
        res.status(500).json({ error: 'Failed to remove clothing item from user' });
    }
});

module.exports = router;