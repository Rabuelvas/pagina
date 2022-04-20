let marcador = null;
let marcador2 = null;
let polyline = null;
let polyline2 = null;
let polyline3 = null;
let start = 0
let end = 0
let circle = null;
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

document.getElementById("start").addEventListener("change", function () {
    var inicio = this.value;
    start = new Date(inicio).getTime();
    document.getElementById("stop").min = this.value
})

document.getElementById("stop").addEventListener("change", function () {
    var fin = this.value
    end = new Date(fin).getTime();
    document.getElementById("start").max = this.value
})

const button = document.getElementById("button");
button.addEventListener("click", function () {

    var fechas = [start, end];
    
    fetch('/historicos', {
        headers: {
            'Content-type': 'application/json'
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

async function getFecha() {
    const res = await fetch('/request')
    let json = await res.json()

    let datos = json.data;

    var Nvector = [];
    
    for (var i = 0, max = datos.length; i < max; i += 1) {

        Nvector.push([datos[i].latitud, datos[i].longitud]);
    }
    polyline2 = L.polyline(Nvector, { color: 'blue' }).addTo(map)
}

let popup = L.popup();

map.on('click', (e) => {

    Vector_r = e.latlng
    console.log(Vector_r)
    if (circle) circle.setLatLng(Vector_r)
    else circle = L.circle(Vector_r, { radius: 1100 }).addTo(map);

    chart.innerHTML = "";

})

const button2 = document.getElementById("button2");
button2.addEventListener("click", function () {

    fetch('/rutas', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify(Vector_r)
    }).then(async res => {
        let json = await res.json()
        datos = json
        console.log(json)
        let Vector_c = []
        json.forEach(e => {
            Vector_c.push(new L.LatLng(e.latitud, e.longitud))
        });

        if (polyline3) polyline3.setLatLngs(Vector_c)
        else polyline3 = L.polyline(Vector_c, { color: 'red',stroke:true,weight: 8 }).addTo(map)

        if (marcador2) marcador2.setLatLng(Vector_c[0])
        else marcador2 = L.marker(Vector_c[0])
            .bindPopup(`
                fecha: ${json[0].fecha} <br>
                hora: ${json[0].hora}
            `)
            .addTo(map)

        slider.max = Vector_c.length - 1;
        slider.value = 0;
    })

})

slider.oninput = e => {
    const history = document.createElement("p");
    history.innerText = `Latitud: ${datos[slider.value].latitud} Longitud: ${datos[slider.value].longitud}    
                         Fecha: ${datos[slider.value].fecha}   Hora: ${datos[slider.value].hora}`
    chart.appendChild(history);
    
    marcador2?.setLatLng([datos[slider.value].latitud, datos[slider.value].longitud])
    marcador2?.bindPopup(`
    fecha: ${datos[slider.value].fecha} <br>
    hora: ${datos[slider.value].hora}
`)
}

function create_hist_item(object, id) {
    const place_item = document.createElement('div');
    place_item.classList.add('place-item');

    const index = document.createElement('div');
    index.classList.add('index');
    index.innerHTML = id;

    const place_content = document.createElement('div');
    place_content.classList.add('place-item-content');

        const place_coords = document.createElement('div');
        place_coords.classList.add('place-item-coords');
        place_coords.innerHTML = `${datos.latitud}, ${datos.longitud}`;

        const place_time = document.createElement('div');
        place_time.classList.add('place-item-time');
        place_time.innerHTML = `${datos.fecha} : ${datos.hora}`;
    place_content.appendChild(place_coords);
    place_content.appendChild(place_time);
    place_item.appendChild(index);
    place_item.appendChild(place_content);

    return place_item;
}