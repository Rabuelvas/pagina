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
let start = 0
let end = 0

document.getElementById("start").addEventListener("change", function() {
    var inicio = this.value;
    start = new Date(inicio).getTime();
})

document.getElementById("stop").addEventListener("change", function() {
    var fin = this.value
    end = new Date(fin).getTime();
    console.log(end)
})

const button = document.getElementById("button");
button.addEventListener("click",function(){

    var fechas =[start,end];
    console.log(fechas)
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
        polyline = L.polyline(array, {color: 'aqua'}).addTo(map)
    }
} 

setInterval(getData,5000);

async function getFecha() {
    const res = await fetch('/request')
    let json = await res.json()

    let datos = json.data;

    var Nvector = [];
    
    for (var i = 0, max = datos.length; i < max; i+=1) {
 
        Nvector.push([datos[i].latitud,datos[i].longitud]);
    }
     polyline2 = L.polyline(Nvector, {color: 'blue'}).addTo(map)
}
