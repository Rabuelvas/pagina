let start = 0
let end = 0
let polyline = null;
let polyline2 = null;

const map = L.map('mapa');
map.setView([10.9767610, -74.8307289], 12);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

document.getElementById("start").addEventListener("change", function () {
  var inicio = this.value;
  start = new Date(inicio).getTime();
  document.getElementById("stop").min = this.value
})

document.getElementById("stop").addEventListener("change", function () {
  var fin = this.value;
  end = new Date(fin).getTime();
  document.getElementById("start").max = this.value
})

const button = document.getElementById("button");

button.addEventListener("click", getFecha)

async function getFecha() {

  const res = await fetch(`/request?inicio=${start}&fin=${end}`)
  let json = await res.json()

  let datos = json.data;
  console.log(datos)
  var Nvector = [];

  for (var i = 0, max = datos.length; i < max; i += 1) {
    Nvector.push([datos[i].latitud, datos[i].longitud]);
  }

  if (polyline) {
    polyline.setLatLngs(Nvector)
  } else {
    polyline = L.polyline(Nvector, { color: 'orange' }).addTo(map)
  }
}

button.addEventListener("click", getFecha2)

async function getFecha2() {

  const res2 = await fetch(`/request2?inicio=${start}&fin=${end}`)
  let json2 = await res2.json()

  let datos2 = json2.data;

  var Nvector2 = [];
  console.log(datos2)

  for (var i = 0, max = datos2.length; i < max; i += 1) {
    Nvector2.push([datos2[i].latitud, datos2[i].longitud]);
  }

  if (polyline2) {
    polyline2.setLatLngs(Nvector2)
  } else {
    polyline2 = L.polyline(Nvector2, { color: 'aqua' }).addTo(map)
  }
}