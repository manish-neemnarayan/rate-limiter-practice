// import csv from 'csvtojson';
// import fs from 'fs';

// const csvFilePath = 'big.csv'; // Replace with your CSV file path
// const jsonFilePath = 'output.json'; // Replace with your desired JSON output file path
// const headers = ['id', 'name', 'desc', 'age']; // Specify the header names here

// csv({
//   headers: headers,
// })
//   .fromFile(csvFilePath)
//   .then((jsonArray) => {
//     // jsonArray is an array of JSON objects
//     // You can now write jsonArray to a JSON file or process it further
//     const jsonString = JSON.stringify(jsonArray, null, 2); // Optional: prettify the JSON
//     console.log(jsonString)
//     fs.writeFileSync(jsonFilePath, jsonString, 'utf-8');
//     console.log(`CSV file converted to JSON and saved as ${jsonFilePath}`);
//   })
//   .catch((error) => {
//     console.error('An error occurred:', error);
//   });

import fs from 'fs';
import csv from 'csv-parser';

const csvFilePath = 'big.csv'; // Replace with your CSV file path
const jsonFilePath = 'output.json'; // Replace with your desired JSON output file path
const jsonArray = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => jsonArray.push(data))
  .on('end', () => {
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2), 'utf-8');
    console.log(`CSV file converted to JSON and saved as ${jsonFilePath}`);
  })
  .on('error', (error) => {
    console.error('An error occurred:', error);
  });
