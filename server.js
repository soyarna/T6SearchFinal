import express from "express";

import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "161.97.144.27",
  port: 8096,
  user: "root",
  password: "guessagain96",
  database: "T6Search",
});

async function query(sql, listOfValues) {
  let result = await db.execute(sql, listOfValues);
  return result[0];
}

const app = express();

app.listen(3000, () => console.log("Server running on port 3000"));

app.use(express.static("client"));

//Music search//
//app.get('/api/music/:search', async (request, response) => {
//let artistCheckbox = document.getElementById("artist");
//if (artistCheckbox.checked) {

//}
//let result = await query(`
//  SELECT *
//FROM mainTable
//WHERE fileType = '.mp3'  -- Get only mp3 files
//AND LOWER
//(CONCAT(metadata->'$.common.album', 
// ' ', 
//metadata->'$.common.artist', 
//' ',
//metadata->'$.common.track', 
//' ',
//metadata->'$.common.year', 
//' ',
//metadata->'$.common.genre',
//   ' ',
//metadata->'$.common.title')) 
//LIKE LOWER(?)
//`, ['%' + request.params.search + '%']);


//response.json(result);


//});

app.get('/api/music/:searchTerm/:MP3searchType', async (request, response) => {
  let searchTerm = request.params.searchTerm;

  let MP3searchType = request.params.MP3searchType;


  let sql = `
   SELECT * 
   FROM mainTable
   WHERE fileType = '.mp3' AND LOWER(metadata -> '$.common.${MP3searchType}') LIKE LOWER (?)
  `;


  if (MP3searchType == 'all') {
    sql = `
      SELECT *
      FROM mainTable
      WHERE fileType = '.mp3' AND LOWER(metadata) LIKE LOWER (?)
    `;
  }

  let result = await query(sql, ['%' + searchTerm + '%']);

  response.json(result);
})



// Picture search

app.get('/api/pictures/:search', async (request, response) => {
  let result = await query(`
SELECT *
FROM mainTable
WHERE fileType = '.jpg'  
AND LOWER(CONCAT(metadata->'$.Make', ' ', metadata->'$.Flash', ' ', metadata->'$.Contrast', ' ', metadata->'$.Sharpness', ' ', metadata->'$.FileSource', ' ', metadata->'$.Saturation')) LIKE LOWER(?)
`, ['%' + request.params.search + '%']);
  // response
  response.json(result);
  //console.log("search", request.params.search)
});


//sök för min-max range 

//app.get('/api/pictures/:type/:min/:max', async (request, response) => {
//let result = await query(`
//SELECT *
//FROM mainTable
//WHERE fileType = '.jpg'  
//AND LOWER(CONCAT(metadata->'$.${request.params.type}')) LIKE LOWER (>= ?) AND LOWER(CONCAT(metadata->'$.${request.params.type}')) LIKE LOWER (<= ?)
//`, [+request.params.min, +request.params.max])
// response 
// response.json(result);
//console.log("min", request.params.min)
//console.log("max", request.params.max)
//console.log("type", request.params.type)
//});




// PDF search

app.get('/api/pdfs/:search', async (request, response) => {
  // Make a database query and remember the result
  let criteria = '%' + request.params.search + '%';
  let result = await query(`
    SELECT *
    FROM mainTable
    WHERE filetype = '.pdf'
    AND LOWER(fileName) LIKE LOWER(?)
    OR LOWER(metadata->'$.info.Title') LIKE LOWER(?)
    OR LOWER(metadata->'$.info.Creator') LIKE LOWER(?)
    OR LOWER(metadata->'$.info.Author') LIKE LOWER(?)
  `, [criteria, criteria, criteria, criteria]);
  // Send a response to the client
  response.json(result);
  //console.log("YOU ASKED FOR pdfs", result)
});


// PPT search

app.get('/api/powerpoints/:search', async (request, response) => {

  let result = await query(`
    SELECT *
    FROM mainTable
    WHERE fileType = '.ppt'
    AND LOWER(CONCAT(metadata->'$.title', ' ', metadata->'$.company', ' ', metadata->'$.file_size', ' ', metadata->'$.slide_count')) LIKE LOWER(?)
  `, ['%' + request.params.search + '%']);
  // Send a response to the client
  response.json(result);
  //console.log("search", request.params.search)
});