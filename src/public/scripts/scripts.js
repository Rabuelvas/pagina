//const { response } = require("express");

const map = L.map('mapa');
map.setView([11.0197889, -74.851362], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);


const long = document.getElementById("long");
const lat = document.getElementById("lat");
const time = document.getElementById("time");
const date = document.getElementById("date");


function getData(){
    fetch('/data')
    .then(response=>{
        return response.json();
    })
    .then(json=>{
        const {latitud, longitud, hora, fecha}=json.data;
        long.innerHTML=longitud;
        lat.innerHTML=latitud;
        time.innerHTML=hora;
        date.innerHTML=fecha
        console.log(latitud);
       
        const marcador = L.marker([latitud, longitud]).bindPopup('Hay un valeverga aquí').addTo(map);
         
        });
} 

setInterval(getData,5000);