

let marcador = null;
let marcador2 = null;

let polyline = null;
let polyline2 = null;
var Vector_r = null;
var slider = document.getElementById("slider");
let datos = null;

const map = L.map('mapa');
map.setView([10.9767610, -74.8307289], 12);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const long = document.getElementById("long");
const lat = document.getElementById("lat");
const time = document.getElementById("time");
const date = document.getElementById("date");
const distance = document.getElementById("distance");
const id = document.getElementById("id");
const chart=document.getElementById("byplace");

var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let array = [];

async function getData() {
    const res = await fetch('/data')
    let json = await res.json()

    const { latitud, longitud, hora, fecha, distancia} = json.data[0];
    long.innerHTML = longitud;
    lat.innerHTML = latitud;
    time.innerHTML = hora;
    date.innerHTML = fecha;
    distance.innerHTML = distancia+"cm";

    let LatLng = new L.LatLng(latitud, longitud)
    array.push(LatLng);

    if (marcador) marcador.setLatLng(LatLng)
    else marcador = L.marker(LatLng, { icon: greenIcon }).bindPopup('Usted está aquí').addTo(map)

    if (polyline) {
        polyline.setLatLngs(array)
    } else {
        polyline = L.polyline(array, { color: 'aqua' }).addTo(map)
    }
}
setInterval(getData, 1000);

const long2 = document.getElementById("long2");
const lat2 = document.getElementById("lat2");
const time2 = document.getElementById("time2");
const date2 = document.getElementById("date2");
const distance2 = document.getElementById("distance2");
const id2 = document.getElementById("id2");
let array2=[];

async function getData2() {
    const res = await fetch('/data2')
    let json = await res.json()

    const { latitud, longitud, hora, fecha, distancia } = json.data[0];
    long2.innerHTML = longitud;
    lat2.innerHTML = latitud;
    time2.innerHTML = hora;
    date2.innerHTML = fecha; 

    let LatLng2 = new L.LatLng(latitud, longitud)
    array2.push(LatLng2);

    if (marcador2) marcador2.setLatLng(LatLng2)
    else marcador2 = L.marker(LatLng2).bindPopup('Usted está aquí').addTo(map)

    if (polyline2) {
        polyline2.setLatLngs(array2)
    } else {
        polyline2 = L.polyline(array2, { color: 'red' }).addTo(map)
    }
}
setInterval(getData2,1000)