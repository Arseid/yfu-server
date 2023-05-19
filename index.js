const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(express.json());
app.use(cors());

const usersRoutes = require('./routes/users');
const clothesRoutes = require('./routes/clothes');
const yfusRoutes = require('./routes/yfus');

app.use('/users', usersRoutes);
app.use('/clothes', clothesRoutes);
app.use('/yfus', yfusRoutes);

app.listen(port, () => {console.log(`Y-Fu Server started on port ${port}`)});

