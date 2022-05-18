let popup = L.popup();
var Vector_r = null;
var Vector_c = null;
let circle = null;
let datos = null;
let polyline3 = null;
let marcador2 = null;
const byplce = document.querySelector('.byplace');
let MINOR_RADIUS = 200
let MAJOR_RADIUS = 1100
let taxi = null;


const map = L.map('mapa');
map.setView([10.9767610, -74.8307289], 12);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const chart = document.getElementById("byplace");
const selector = document.getElementById("selector");

selector.addEventListener('change', (e)=>{
    taxi = e.target.value
    console.log(taxi)
})

map.on('click', (e) => {

    Vector_r = e.latlng
    if (circle) circle.setLatLng(Vector_r)
    else circle = L.circle(Vector_r, { radius: MAJOR_RADIUS }).addTo(map);
    circle.setRadius(MAJOR_RADIUS)

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
        Vector_c = []
        json.forEach(e => {
            Vector_c.push(new L.LatLng(e.latitud, e.longitud))
        });

        if (polyline3) polyline3.setLatLngs(Vector_c)
        else polyline3 = L.polyline(Vector_c, { color: 'red', stroke: true, weight: 8 }).addTo(map)

        if (marcador2) marcador2.setLatLng(Vector_c[0])
        else marcador2 = L.marker(Vector_c[0])
            .bindPopup(`
                fecha: ${json[0].fecha} <br>
                hora: ${json[0].hora}
            `)
            .addTo(map)
        circle.setLatLng(Vector_c[0])
        circle.setRadius(MINOR_RADIUS)

        slider.max = Vector_c.length - 1;
        slider.value = 0;
        oninput()
    })

})


const oninput = e => {
    console.log(datos[slider.value]);

    const center = [datos[slider.value].latitud, datos[slider.value].longitud]
    Vector_r = center
    if (circle) circle.setLatLng(Vector_r)
    else circle = L.circle(Vector_r, { radius: MINOR_RADIUS }).addTo(map);
    circle.setRadius(MINOR_RADIUS)


    marcador2.setLatLng(center)

    const formatCenter = circle.getLatLng()

    var cont = 0;
    byplce.innerHTML = null;
    for (var [i, marker] of datos.entries()) {
        if (Math.abs(formatCenter.distanceTo([marker.latitud, marker.longitud])) < 150) {
            const hist_item = create_hist_item(cont, i);
            byplce.appendChild(hist_item)
            cont++
        }
    }

    let dist;
    if (!datos[slider.value].distancia) { dist = "" }
    else { dist = `<br>Distancia: ${datos[slider.value].distancia}cm` }
    marcador2.bindPopup(`
        Fecha: ${datos[slider.value].fecha} <br>
        Hora: ${datos[slider.value].hora} ${dist}
    `)
}

slider.oninput = oninput

function create_hist_item(id, i) {
    const place_item = document.createElement('div');
    place_item.classList.add('place-item');

    const index = document.createElement('div');
    index.classList.add('index');
    index.innerHTML = datos[i].distancia?datos[i].distancia+"cm":"";

    const place_content = document.createElement('div');
    place_content.classList.add('place-item-content');

    const place_coords = document.createElement('div');
    place_coords.classList.add('place-item-coords');
    place_coords.innerHTML = `${datos[i].latitud}, ${datos[i].longitud}`;

    const place_time = document.createElement('div');
    place_time.classList.add('place-item-time');
    place_time.innerHTML = `${datos[i].fecha} : ${datos[i].hora}`;

    place_content.appendChild(place_coords);
    place_content.appendChild(place_time);
    place_item.appendChild(place_content);
    place_item.appendChild(index)

    return place_item;
}