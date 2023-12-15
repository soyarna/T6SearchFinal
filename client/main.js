
import express from 'express';

import mysql from 'mysql2/promise';

const app = express();

app.use(express.static('client'));

app.listen(3000, () =>
  console.log('Listening on http://localhost:3000'));


const db = await mysql.createConnection({
  host: '161.97.144.27',
  port: 8098,
  user: 'root',
  password: 'guessagain96',
  database: 'T6Search'
});


async function query(sql, listOfValues) {
  let result = await db.execute(sql, listOfValues);
  return result[0];
}

app.get('/api/cats', async (request, response) => 
{
  let result = await query(`
    SELECT *
    FROM cats
  `);
 
  response.json(result);
});

