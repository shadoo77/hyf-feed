"use strict";

const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const {validation, normalization} = require('../validation/validate');
const {housesArrayProduce, statusArray} = require('../validation/itemsConfig');

const db = require('../../db-config');
const express = require('express');
const router = express.Router();

// Get all cities
router.get('/cities', (req, res, next) => {
    const promise = new Promise ((resolve, reject) => {
            const query = "SELECT location_city, count(*) AS Count FROM houses GROUP BY location_city";
            db.query(query, (err, results, fields) => {
                if(err) reject(err);
                else {
                    resolve(results);
                }
            });
    });
    promise
      .then(data => {
          if(data.length < 1) return res.status(301).json({message: 'There are no cities!'});
          else {
              return res.status(200).json(data);
          }
      })
      .catch(err => {
        res.status(400).json({error: err})
      });
});

// Get all houses
router.get('/list', (req, res, next) => {
    retrieveAllHouses(null)
      .then(data => {
          if(data.length < 1) return res.status(301).json({message: 'There are no houses!'});
          else {
              return res.status(200).json(data);
          }
      })
      .catch(err => {
        res.status(500).json({error: err})
      });
});

// Get houses of one certain city limit 50
router.get('/list/searchData', (req, res, next) => {
    const reqQuery = {city: req.query.city, limit: req.query.limit};
    retrieveAllHouses(reqQuery)
      .then(data => {
          if(data.length < 1) return res.status(301).json({message: 'There are no houses!'});
          else {
              return res.status(200).json(data);
          }
      })
      .catch(err => {
        res.status(500).json({error: err})
      });
});

// get a status of the city
router.get('/status', (req, res, next) => {
    const {city} = req.query;
    const promise = new Promise ((resolve, reject) => {
            const query = "SELECT * FROM city_status WHERE city = ?";
            db.query(query, [city], (err, results, fields) => {
                if(!err) resolve(results);
                else reject(err);
            });
    });
    promise
      .then(data => {
          if(data.length < 1) return res.status(301).json({message: 'There are no cities!'});
          else {
              return res.status(200).json(data);
          }
      })
      .catch(err => {
        res.status(500).json({error: err})
      });
});

// retrieve data to check it
function retrieveAllHouses(reqQuery) {
    return new Promise ((resolve, reject) => {
        if(reqQuery) {
            const {city, limit} = reqQuery;
            const query = "SELECT * FROM houses WHERE location_city=? LIMIT ?";
            db.query(query, [city, Number(limit)], (err, results, fields) => {
                if(!err) resolve(results);
                else reject(err);
            });
        }else {
            const query = "SELECT * FROM houses";
            db.query(query, (err, results, fields) => {
                if(!err) resolve(results);
                else reject(err);
            });
        }
    });
}

// add json file handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './client/public/uploaded-files');
    },
    filename: (req, file, cb) => {
      const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, newFilename);
    }
  });
  // create the multer instance that will be used to upload/save the file
  const upload = multer({ storage });


  router.post('/addjson', upload.single('selectedFile'), (req, res, next) => {
      
      const xx = req.file.path;
      const myFile = './' + xx;
        
    const deleteFile = (file) => {
        fs.unlink(file, (err) => {
            if (err) throw err;
        });
    };
    setTimeout(() => {
        deleteFile(myFile);
    }, 30 * 6000);

    readJsonFile(myFile)
        .then(data => {
            const myData = JSON.parse(data);
            if (Array.isArray(myData) && myData.length < 1) {
                res.status(404).json({ message: "The json file is empty!" });
            }else if(isEmptyObject(myData)) {
                res.status(404).json({ message: "The json file is empty!" });
            }else {
                const report = loopInValidation(myData);
                //res.status(200).json(report.errReport);
                const filterdData = loopInNormalization(report.validItems);
                const houses = housesArrayProduce(filterdData);
                const cityStatus = statusArray(filterdData);
                    
                const responseResult = insertIntoDatabase(report, houses, cityStatus);
                res.status(200).json(responseResult);
            }
        })
        .catch(err => res.status(404).json({ invalidJson: err }));

    /*if (req.file.filename.match(".json$", "i")) {
        res.status(200).json(req.file);
    } else {
        res.status(403).json({errorFile: "nooooooo"});
    }
    // Or this ::
    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    */
  });

router.post('/addjson-url', (req, res, next) => {
    //https://api.apify.com/v1/execs/LwyNy3bGfXRuwS5w9/results?format=json&simplified=1
    const {link} = req.body;
  fetchJsonURL(link)
      .then(data => {
          if (Array.isArray(data) &&  data.length < 1) {
              res.status(404).json({ message: "The json file is empty!" });
          }else if(isEmptyObject(data)) {
            res.status(404).json({ message: "The json file is empty!" });
          }else {
              const report = loopInValidation(data);
              const filterdData = loopInNormalization(report.validItems);
              const houses = housesArrayProduce(filterdData);
              const cityStatus = statusArray(filterdData);
              
              const responseResult = insertIntoDatabase(report, houses, cityStatus);
              res.status(200).json(responseResult);
          }
      })
      .catch(err => res.status(404).json({ invalidJson: err }));
});

  function insertIntoDatabase(report, houses, cityStatus) {
    // let storeHousesQuery = "REPLACE INTO houses (link, market_date, location_country, location_city, location_address, location_coordinates_lat,";
    // storeHousesQuery += " location_coordinates_lng, size_grossm2, size_rooms, price_value, price_currency, description,";
    // storeHousesQuery += "title, images, sold) VALUES ?";
    // db.query(storeHousesQuery, [houses], (err, results, fields) => {
    //     if(err) console.log("error with inserting data!", err);
    //     else console.log("Data inserted!");
    // });
    // const statusQuery = "REPLACE INTO city_status (id, city, market_date, total_price, total_count, total_m2) VALUES ?";
    // db.query(statusQuery, [cityStatus], (err, results, fields) => {
    //     if(err) console.log("error with inserting data!", err);
    //     else console.log("Data inserted!");
    // });
    return {
        insertedItems: houses.length,
        errors: report.errReport.length,
        errMessages: report.errReport
    };
  }

function isEmptyObject(obj) {
    return !obj || Object.keys(obj).length === 0;
}

function loopInValidation(data) {
    const result = {};
    let final = [];
    let err = [];
    if (Array.isArray(data)) {
        data.forEach((el, i) => {
            let process = validation(el);
            if(process.valid) final.push(el);
            else {
                const report = {
                    id: i + 1,
                    messages: process.messages
                }
                err.push(report);
            }
        });
        result.validItems = final;
        result.errReport = err;
    }else {
        let process = validation(data);
        if(process.valid) final.push(data);
        else {
            const report = {
                id: 1,
                messages: process.messages
            }
            err.push(report);
        }
        result.validItems = final;
        result.errReport = err;
    }
    return result;
}

function loopInNormalization(data) {
    let filterdData = [];
    data.forEach(el => {
        const item = normalization(el);
        filterdData.push(item);
    });
    return filterdData;
}

function fetchJsonURL(url) {
    return fetch(url)
                .then(response => response.json())
                .catch(err => console.log(err));
}


function readJsonFile(file) {
    return new Promise ((resolve, reject) => {
        fs.readFile(file, (error, data) => {
            if(error) reject(error);
            else resolve(data);
        });
    });
}

module.exports = router;