const express = require("express")
const app = express()
const db = require("./database.js")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/monitoring-values", (req, res, next) => {
    const sql = "select * from cleanroom"
    const params = []
    db.all(sql, params, (err, rows) => {
        console.log("here?")
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});
