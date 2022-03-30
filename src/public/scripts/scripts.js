const map = L.map('mapa');
map.setView([11.0197889, -74.851362], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marcador = null;
let polyline = null;
let polyline2 = null;

const long = document.getElementById("long");
const lat = document.getElementById("lat");
const time = document.getElementById("time");
const date = document.getElementById("date");
let resultado = 0;
let resultado2 = 0;
let tiempo = 0;
let tiempo2 = 0;
let fecha_in = 0;


document.getElementById("start").addEventListener("change", function() {
    var inicio = this.value;
    var start = new Date(inicio)
    var month = '' + (start.getMonth() + 1),
    day = '' + start.getDate(),
    year = start.getFullYear();

    if (month.length < 2) 
    month = '0' + month;
    if (day.length < 2) 
    day = '0' + day;

    resultado =[year, month, day].join('-');

    tiempo = start.toLocaleTimeString("en-GB")
})

document.getElementById("stop").addEventListener("change", function() {
    var fin = this.value
    var end = new Date(fin)
    var month = '' + (end.getMonth() + 1),
    day = '' + end.getDate(),
    year = end.getFullYear();

    if (month.length < 2) 
    month = '0' + month;
    if (day.length < 2) 
    day = '0' + day;

    resultado2 =[year, month, day].join('-');
    
    tiempo2 = end.toLocaleTimeString("en-GB")

})

const button = document.getElementById("button");
button.addEventListener("click",function(){

    var fechas =[resultado,tiempo,resultado2,tiempo2];
    
    fetch('/historicos' ,{
        headers:{
            'Content-type':'application/json'
        },
        method: 'post',
        body: JSON.stringify(fechas)
    }).then(res => res.json())

    getFecha();
})


let array = [];

async function getData() {
    const res = await fetch('/data')
    let json = await res.json()

    const {latitud, longitud, hora, fecha} = json.data[0];
    long.innerHTML=longitud;
    lat.innerHTML=latitud;
    time.innerHTML=hora;
    date.innerHTML=fecha;

    let LatLng = new L.LatLng(latitud, longitud)
    array.push(LatLng);

    if (marcador) marcador.setLatLng(LatLng)
    else marcador = L.marker(LatLng).bindPopup('Usted está aquí').addTo(map)

    if (polyline) {
        polyline.setLatLngs(array)
    }else {
        polyline = L.polyline(array, {color: 'red'}).addTo(map)
    }
} 

setInterval(getData,5000);

async function getFecha() {
    const res = await fetch('/request')
    let json = await res.json()

    fecha_in = json.data;

    var Nvector = [];
 
    for (var i = 0, max = fecha_in.length; i < max; i += 1) {
 
        Nvector.push([fecha_in[i].latitud,fecha_in[i].longitud]);
 
     }
     polyline2 = L.polyline(Nvector, {color: 'blue'}).addTo(map)
}