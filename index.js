const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const bodyParser = require('body-parser');

const connection = mysql.createConnection({
  host:'localhost',
  user:'peiling',
  password:'peiling',
  database:'cars'
});

connection.connect((err) =>{
  if(err){
    throw err;
  }
  else{
    console.log('connected to database');
  }
});

app.listen(port, () => {
  console.log('server running on port: ', port);
});


app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/car',(req,res) => {
  res.setHeader('Content-Type','application/json');
  connection.query('SELECT * FROM cars', (err,cars) => {
    if(err){
      throw err;
    }
    else{
      res.send(cars);
    }
  })
});

app.post('/api/car', (req,res) =>{
  let content = req.body;
  connection.query('INSERT INTO cars SET ?',content, (err, result) => {
    if(err) throw err;
    res.send(result);
  });
});

app.get('/api/car/:id', function(req, res) {

  let id = req.params.id;

  connection.query('SELECT * FROM cars where id=?', id, (err, rows) => {
    if (!err) {

      let car = rows[0];


      if (car) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(car));
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).end();
      }
    } else {
      throw err;
    }
  });
});

app.delete('/api/car/:id', function(req, res) {
  let id = req.params.id;

  connection.query(
    'DELETE FROM cars WHERE id = ?', [id], (err, result) => {
      if (!err) {
        console.log(`Deleted ${result.affectedRows} row(s)`);
        res.status(204).end();
      }
      else {
        throw err;
      }
    }
  );
});

app.put('/api/car/:id', function(req, res) {


        let id = +req.params.id
        let inputUser = req.body;


        connection.query(
          'UPDATE cars SET license_plate = ?, mileage = ?, price = ? Where ID = ?',
          [inputUser.license_plate, inputUser.mileage,inputUser.price, id],
          (err, result) => {
            if (!err) {
              console.log(`Changed ${result.changedRows} row(s)`);

              // end of the update => send response
              // execute a query to find the result of the update
              connection.query('SELECT * FROM cars where id=?', [id], (err, rows) => {
                if (!err) {
                  console.log('Data received from Db:\n');

                  let user = rows[0];

                  console.log(user);
                  if (user) {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify(user));
                  } else {
                    res.setHeader('Content-Type', 'application/json')
                    console.log("Not found!!!");
                    res.status(404).end(); // rloman send 404???
                  }
                } else {
                  throw err;
                }
              });
            }
            else {
              throw err;
            }
      });
});
