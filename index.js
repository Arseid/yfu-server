const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');

app.use(express.json());
app.use(cors());

const usersRoutes = require('./routes/users');

app.use('/users', usersRoutes);

app.listen(port, () => {console.log(`Y-Fu Server started on port ${port}`)});

