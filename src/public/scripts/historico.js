let start = 0
let end = 0
let marcador2 = null;
let polyline = null;

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