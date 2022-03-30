const express = require("express");
const path = require("path");
const mysql = require("mysql")
require('dotenv').config()

var hist
let fecha_in=0
let hora_in =0
let fecha_fin=0
let hora_fin=0

const data = {
  lat: "",
  long: "",
  time: "",
  date: ""
}

var con = mysql.createConnection({  
  host: process.env.HOST,  
  user: process.env.USER_DB,  
  password: process.env.PASSWORD,  
  database: process.env.DB  
});  
con.connect(function(err) {  
if (err) throw err;  
console.log("Connected!");})  

const app = express();
app.use(express.static(path.join(__dirname , "public")));
app.use(express.json())

app.get("/", (req, res) => {
  console.log(true)
  res.sendFile(path.join(__dirname + "/public/main.html"));
});

app.get('/data',(req,res)=>{
  con.query('select * from datos ORDER BY id DESC LIMIT 1',(err,message)=>{
   
     res.status(200).json({
      data: message
      
      
    });
    
  });
});

const dgram = require('dgram');
const req = require("express/lib/request");
const server = dgram.createSocket('udp4');
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});
server.on('message', async (msg, senderInfo) => {
  console.log('Messages received ' + msg)
  const mensaje = String(msg).split("\n")

  const variables = 
  data.lat = mensaje[0].split(" ")[1]
  data.long = mensaje[1].split(" ")[1]
  data.time = mensaje[2].split(" ")[2]
  data.date = mensaje[2].split(" ")[1].slice(1)

  var sql = `INSERT INTO datos (latitud , longitud, hora, fecha) VALUES ('${data.lat}','${data.long}','${data.time}','${data.date}')`;
  con.query(sql, function (err, result) {  
    if (err) throw err;  
    console.log("dato recibido");  
    });  
});
server.on('listening', (req, res) => {
  const address = server.address();
  console.log(`server listening on ${address.address}:${address.port}`);
});

app.post("/historicos", function(req, res) {
  
    hist = req.body;
    fecha_in= hist[0];
    hora_in = hist[1];
    fecha_fin=hist[2];
    hora_fin=hist[3];

    console.log(hist)
    
});

app.get('/request',(req,res)=>{

    con.query(`select latitud,longitud from datos where fecha between '${fecha_in}' and '${fecha_fin}' 
    and hora between '${hora_in}' and '${hora_fin}' order by id`,(err, historial,fields)=>{
      
      res.status(200).json({
        data: historial,
      });
    })

})


server.bind(3020);

app.listen(3000,()=>{
    console.log(`server connected http://localhost:${3000}`)
});