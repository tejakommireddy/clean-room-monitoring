var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite" 

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE cleanroom (
            temparature REAL,
            humidity REAL, 
            pressure REAL, 
            max_temparature INTEGER, 
            max_humidity INTEGER, 
            max_pressure INTEGER, 
            date TEXT,
            time TEXT
            )`,(err) => {
        if (err) {
            //if table already exists, do nothing.
        }else{
            // Table just created, creating some rows
            var insert = 'INSERT INTO cleanroom (temparature, humidity, pressure, max_temparature, max_humidity, max_pressure, date, time) VALUES (?,?,?,?,?,?,?,?)'
            db.run(insert, ["10","65", "29", "30", "65", "31", "2020-12-30", "14:00"])
            db.run(insert, ["20","64", "26", "29", "65", "31", "2020-12-30", "15:00"])
            console.log("Test data created in the DB");
        }
    })  
    }
})


module.exports = db
