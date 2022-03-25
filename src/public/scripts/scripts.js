const map = L.map('mapa');
map.setView([11.0197889, -74.851362], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marcador = null;
let polyline = null;

const long = document.getElementById("long");
const lat = document.getElementById("lat");
const time = document.getElementById("time");
const date = document.getElementById("date");
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