import { personIcon } from "./js/constant.js";

window.navigator.geolocation.getCurrentPosition(
  (e) => {
    console.log(e);

    loadMap([e.coords.latitude, e.coords.longitude], "Currently Location");
  },
  (e) => {
    loadMap([39.921132, 32.861194], "Varsayilan Konum");
  }
);

function loadMap(currentPosition, msg) {
  //Harita kurulumu
  var map = L.map("map").setView(currentPosition, 10);

  //Harita kurulumu Haritanin ekranda render edilmesini saglar
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  //Zoom butonlarini ekranin sag asagisina tasi

  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(map);

  //Imlec ekle12
  L.marker(currentPosition, { icon: personIcon }).addTo(map).bindPopup(msg);
  //Haritaya tiklanma ol,ayi gerceklesince

  map.on("click", onMapClick);
}

//Harika tiklanma olayini izle

function onMapClick(e) {
  // Tiklanilma Olayi
  alert("Tiklandi");

  clickedCords = (e.latlng.lat, e.latlng.lng);
  console.log(clickedCords);
}
