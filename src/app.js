const express = require('express');
const { initDB } = require('./db');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT || 3000;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;