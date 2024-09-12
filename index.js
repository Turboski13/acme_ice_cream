const express = require('express')
const pg = require('pg')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/postgres')
const app = express()
const port = 3000

const init = async () => {
    console.log('connected to database');
    let SQL = ``;
    await client.query(SQL);
    console.log('tables created');
    SQL = ` `;
    await client.query(SQL);
    console.log('data seeded');
  };
  
  init();


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/flavors', async (req, res) => {
    const response = await client.query("SELECT * FROM flavors");
    res.json(response.rows);
})

app.post('/api/flavors', async (req, res) => {
    const { id, name, is_favorite } = req.body;
    console.log(req.body)
    const response = await client.query("INSERT INTO flavors (id, name, is_favorite) VALUES ($1, $2, $3)", [id, name, is_favorite]);
    res.json(`succesfully added flavor: ${name}`);
})

app.put('/api/flavors/:id', async (req, res, next) => {
    try {
      const SQL = `
        UPDATE flavors
        SET name=$1, is_favorite=$2, updated_at= now()
        WHERE id=$3 RETURNING *
      `
      const response = await client.query(SQL, [req.body.name, req.body.is_favorite, req.params.id])
      res.send(response.rows[0])
    } catch (ex) {
      next(ex)
    }
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
