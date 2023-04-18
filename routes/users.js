const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json('Salut ceci est un test');
});

module.exports = router;