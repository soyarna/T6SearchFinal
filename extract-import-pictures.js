import fs from 'fs';

import exifr from 'exifr';

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


let pictures = fs.readdirSync('client/pictures');

let counter = 0;
for (let picture of pictures) {
  if (picture.includes('.JPG')) {
    let metadata = await exifr.parse('client/pictures/' + picture);
    console.log(counter);
    counter = counter + 1;
    let result = await query(`
     INSERT INTO mainTable (fileType, fileName, metadata)
     VALUES(?, ?, ?)
  `, ['.jpg', picture, metadata]);
  }
} 