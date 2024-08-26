const express = require('express');
const path = require('path');
const { fetchItems } = require('./meliservice');

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir acceso a archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/meli/items', async (req, res) => {
  try {
    const items = await fetchItems();
    res.json(items);
  } catch (error) {
    res.status(500).send('Error retrieving items');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});