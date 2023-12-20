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
app.get("/music/:search", async (request, response) => {

  let result = await query(`
      SELECT *
      FROM mainTable
      WHERE filetype = '.mp3'  -- Get only mp3 files
      AND LOWER
    (CONCAT(metadata->'$.common.album', 
    ' ', 
    metadata->'$.common.artist', 
    ' ',
    metadata->'$.common.track', 
    ' ',
    metadata->'$.common.year', 
    ' ',
    metadata->'$.common.duration',
    ' ',
    metadata->'$.common.URL')) 
    LIKE LOWER('%${request.params.search}%')
    `);


  response.json(result);

  //console.log("YOU ASKED FOR MUSIC", result)
});



//Pictures search//

//'frågan' utkommenterad då jag vill generalisera söket med type, kolla nedan
//app.get('/api/pictures/:search', async (request, response) => {
// let result = await query(`
//SELECT *
//FROM mainTable
//WHERE fileType = '.jpg'
//AND metadata->'$.ISO' LIKE ?
//`, ['%' + request.params.search + '%']);
// Send a response to the client
// response.json(result);
//console.log("search", request.params.search)
//});



//allmän sök för olika delar(typer) av metadata

app.get('/api/pictures/:type/:search', async (request, response) => {
  let result = await query(`
SELECT *
FROM mainTable
WHERE fileType = '.jpg'  
AND LOWER(CONCAT(metadata->'$.${request.params.type}')) LIKE LOWER(?)
`, ['%' + request.params.search + '%']);
  // response
  response.json(result);
  //console.log("search", request.params.search)
  //console.log("type", request.params.type)
});

//sök för min-max range 

app.get('/api/pictures/:type/:min/:max', async (request, response) => {
  let result = await query(`
SELECT *
FROM mainTable
WHERE fileType = '.jpg'  
AND LOWER(CONCAT(metadata->'$.${request.params.type}')) LIKE LOWER (>= ?) AND LOWER(CONCAT(metadata->'$.${request.params.type}')) LIKE LOWER (<= ?)
`, [+request.params.min, +request.params.max])
  // response 
  response.json(result);
  //console.log("min", request.params.min)
  //console.log("max", request.params.max)
  //console.log("type", request.params.type)
});




// PDF search

app.get('/api/pdfs/:search', async (request, response) => {
  // Make a database query and remember the result
  let result = await query(`
    SELECT *
    FROM mainTable
    WHERE filetype = '.pdf'
    AND LOWER(CONCAT(metadata->'$.info.Title', ' ', metadata->'$.info.Creator', ' ', metadata->'$.info.Producer', ' ', metadata->'$.info.Author')) LIKE LOWER(?)
  `, ['%' + request.params.search + '%']);
  // Send a response to the client
  response.json(result);
  //console.log("YOU ASKED FOR pdfs", result)
});


// PPT search

app.get('/api/ppts/:search', async (request, response) => {
  // Make a database query and remember the result
  let result = await query(`
    SELECT *
    FROM mainTable
    WHERE filetype = '.ppt'
    AND LOWER(CONCAT(metadata->'$.title', ' ', metadata->'$.company', ' ', metadata->'$.file_size', ' ', metadata->'$.slide_count',' ', metadata->'$.creation_date)) LIKE LOWER(?)
  `, ['%' + request.params.search + '%']);
  // Send a response to the client
  response.json(result);
  console.log("search", request.params.search)
});