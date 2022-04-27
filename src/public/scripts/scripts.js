let marcador = null;
let polyline = null;
let polyline2 = null;
let polyline3 = null;
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

    const { latitud, longitud, hora, fecha } = json.data[0];
    long.innerHTML = longitud;
    lat.innerHTML = latitud;
    time.innerHTML = hora;
    date.innerHTML = fecha;

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