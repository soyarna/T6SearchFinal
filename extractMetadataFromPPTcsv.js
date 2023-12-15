// Import the file system module (fs)
import fs from 'fs';

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

// Read the json string from file
let json = fs.readFileSync('./pp-json-from-csv.json', 'utf-8');

// Convert from a string to a real data structure
let data = JSON.parse(json);


for (let metadata of data) {
  // extract the file name (the property digest + '.ppt)
  let fileName = metadata.digest + '.ppt';

  // remove the file name
  // delete powerpointMetadata.digest;

  // remove sha hashes as well (only needed for file authenticy checks)
  // delete powerpointMetadata.sha256;
  // delete powerpointMetadata.sha512;

  // console.log things to see that we have correct 
  // filname and metadata
  // (that eventually want to write to the db)
  //console.log('');
  //console.log(fileName);
  //console.log(powerpointMetadata);

  // TODO: Do something like this to INSERT the data in our database
  let result = await query(`
    INSERT INTO mainTable (fileType, fileName, metadata)
    VALUES(?, ?, ?)
  `, ['.ppt', fileName, metadata]);
  console.log(result);

}
