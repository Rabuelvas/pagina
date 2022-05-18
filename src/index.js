const express = require("express");
const path = require("path");
const mysql = require("mysql")
require('dotenv').config()

var hist
let fecha_in=0
let fecha_fin=0
let fecha=0
let press_lat=0
let press_lng=0
var ruta

const dgram = require('dgram');
const req = require("express/lib/request");
const { timeStamp } = require("console");
const server = dgram.createSocket('udp4');

const data = {
  lat: "",
  long: "",
  time: "",
  date: "",
  distance: "",
  id: ""
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
  res.sendFile(path.join(__dirname + "/public/main.html"));
});
app.get("/ruta", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/ruta.html"));
});

app.get("/historico", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/historico.html"));
});

app.get('/data',(req,res)=>{
  con.query('select * from datos where idTaxi="ABC123" ORDER BY id DESC LIMIT 1',(err,message)=>{
   
     res.status(200).json({
      data: message
      
      
    });

  });
});

app.get('/data2',(req,res)=>{
  con.query('select * from datos where idTaxi="DEF456" ORDER BY id DESC LIMIT 1',(err,message)=>{
   
     res.status(200).json({
      data: message
      
      
    });
  });
});


server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});
server.on('message', async (msg, senderInfo) => {
  console.log('Messages received ' + msg)
  const mensaje = String(msg).split("\n")
  console.log(mensaje)
  
  var id;
  if(mensaje != ''){
    data.lat = mensaje[0].split(" ")[1];
    data.long = mensaje[1].split(" ")[1];
    data.time = mensaje[2].split(" ")[2];
    data.date = mensaje[2].split(" ")[1].slice(1);
    fecha = data.date+" "+data.time;
    var ts = new Date(fecha).getTime();
    if(mensaje.length==4){
      data.id=mensaje[3].split(" ")[1]
      
    }else{
      data.distance = mensaje[3].split(" ")[1];
      
      data.id=mensaje[4].split(" ")[1];
    }
    console.log(data.distance)
    console.log(data.id)

    if(data.distance) var sql = `INSERT INTO datos (idTaxi, latitud , longitud, hora, fecha,timestamp,distancia) VALUES ('${data.id}','${data.lat}','${data.long}','${data.time}','${data.date}','${ts}','${data.distance}')`;
    else var sql = `INSERT INTO datos (idTaxi, latitud , longitud, hora, fecha,timestamp) VALUES ('${data.id}','${data.lat}','${data.long}','${data.time}','${data.date}','${ts}')`;
    con.query(sql, function (err, result) {  
    if (err) throw err;  
    console.log("dato recibido");  
    });  
  }
});

server.on('listening', (req, res) => {
  const address = server.address();
  console.log(`server listening on ${address.address}:${address.port}`);
});

/* app.post("/historicos", function(req, res) {
  
    hist = req.body;
    fecha_in= hist[0];
    fecha_fin=hist[1];
    res.status(200).send('ok')
}); */

app.get('/request',(req,res)=>{

    let {inicio, fin} = req.query;
    con.query(`select latitud,longitud from datos where idTaxi = "ABC123" and timestamp between'${inicio}' and '${fin}' 
      order by id`,(err, historial,fields)=>{
      
      res.status(200).json({
        data: historial,
      });
    })

})

app.get('/request2',(req,res2)=>{

  let {inicio, fin} = req.query;
  con.query(`select latitud,longitud from datos where idTaxi = "DEF456" and timestamp between'${inicio}' and '${fin}' 
    order by id`,(err, historial,fields)=>{
    
    res2.status(200).json({
      data: historial,
    });
  })

})

app.post("/update", function(req, res) {
  console.log("Actualizado")

})

app.post("/rutas", function(req, res) {
  
  ruta = req.body;
  press_lat=ruta.lat;
  press_lng=ruta.lng;

  var rutas = con.query(`select * from datos where (latitud-'${press_lat}')*(latitud-'${press_lat}')+(longitud-('${press_lng}'))*(longitud-('${press_lng}'))<0.0001 order by id`,
  (err, historial,fields)=>{
    
    res.json(historial)
  })

});

/* app.post("/rutas2", function(req, res) {
  
  ruta = req.body;
  press_lat=ruta.lat;
  press_lng=ruta.lng;

  var rutas = con.query(`select * from datos where taxiId="DEF456" (latitud-'${press_lat}')*(latitud-'${press_lat}')+(longitud-('${press_lng}'))*(longitud-('${press_lng}'))<0.0001 order by id`,
  (err, historial,fields)=>{
    
    res.json(historial)
  })

});
 */
server.bind(3020);

app.listen(3000,()=>{
    console.log(`server connected http://localhost:${3000}`)
});