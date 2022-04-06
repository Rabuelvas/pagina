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


document.getElementById("start").addEventListener("change", function() {
    var inicio = this.value;
    start = new Date(inicio).getTime();
    document.getElementById("stop").min = this.value
})

document.getElementById("stop").addEventListener("change", function() {
    var fin = this.value
    end = new Date(fin).getTime();
    document.getElementById("start").max = this.value
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

let popup = L.popup();

map.on('click', (e) =>{
    
    Vector_r = e.latlng
    console.log(Vector_r)

    if (circle) circle.setLatLng(Vector_r)
    else  circle=L.circle(Vector_r, {radius: 1100}).addTo(map);
})

const button2 = document.getElementById("button2");
button2.addEventListener("click",function(){
    
    fetch('/rutas' ,{
        headers:{
            'Content-type':'application/json'
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
        else  polyline3 = L.polyline(Vector_c,{color: 'red'}).addTo(map)
        
        if (marcador2) marcador2.setLatLng(Vector_c[0])
        else  marcador2 = L.marker(Vector_c[0])
            .bindPopup(`
                fecha: ${json[0].fecha} <br>
                hora: ${json[0].hora}
            `)
            .addTo(map)

        slider.max=Vector_c.length-1;
        slider.value=0;

    })

})
    
slider.onchange = e => {
    marcador2?.setLatLng([datos[slider.value].latitud, datos[slider.value].longitud])
    marcador2?.bindPopup(`
    fecha: ${datos[slider.value].fecha} <br>
    hora: ${datos[slider.value].hora}
`)
}
