
import fs from 'fs';

import musicMetadata from 'music-metadata';

import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: '161.97.144.27', 
  port: 8096,               
  user: 'root',
  password: 'guessagain96',  
  database: 'T6Search'
});

async function query(sql, listOfValues) {
  let result = await db.execute(sql, listOfValues);
  return result[0];
}

const files = await fs.readdirSync('music');

for (let file of files) {


  let metadata = await musicMetadata.parseFile('./music/' + file);

  let result = await query(`
    INSERT INTO mainTable (fileType, fileName, metadata)
    VALUES(?, ?, ?)
  `, ['.mp3', file, metadata]);

  console.log(file, result);

}

process.exit();