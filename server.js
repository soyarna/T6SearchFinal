//import fs from "fs";
import express from "express";

//import musicMetadata from "music-metadata";

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

  app.get("/music/:search", async (request, response) => {
    // Make a database query and remember the result
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
 

  // Send a response to the client
  response.json(result);

  //console.log("YOU ASKED FOR MUSIC", result)
});

//process.exit();


