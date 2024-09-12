const express = require('express')
const pg = require('pg')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/postgres')
const app = express()
const port = 3000


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/flavorss', async (req, res) => {
    const response = await client.query("SELECT * FROM flavors");
    res.json(response.rows);
})

app.post('/api/flavors', async (req, res) => {
    const { id, name, is_favorite } = req.body;
    const response = await client.query("INSERT INTO flavors (id,name, is_favorite) VALUES ($1, $2, $3)", [id, name, is_favorite]);
    res.json(`succesfully added flavor: ${name}`);
})

app.delete('/api/flavors/:id', async (req, res) => {
    const { id } = req.params;
    const response = await client.query("DELETE FROM flavors WHERE id = $1", [id]);
    res.json(`succesfully deleted flavor: ${id}`);
})

app.listen(port, async () => {
    await client.connect();
    console.log(`Example app listening on port ${port}`)
})
