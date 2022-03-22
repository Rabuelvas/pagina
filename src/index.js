const express = require("express");
const path = require("path");
const mysql = require("mysql")

const data = {
  lat: "",
  long: "",
  time: "",
  date: ""
}

var con = mysql.createConnection({  
host: "database-diseno.cw48hb7r0nz7.us-east-1.rds.amazonaws.com",  
user: "admin",  
password: "rabt28161",  
database: "diseno"  
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
    console.log(message)
     res.status(200).json({
      data: message[0]
      
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


server.bind(3020);

app.listen(3000,()=>{
    console.log(`server connected http://localhost:${3000}`)
});