import { personIcon } from "./js/constant.js";
import { getIcon, getStatus } from "./js/helpers.js";
import { ui } from "./js/ui.js";

/* Kullanıcının konum bilgisine erişmek için izin isteyeceğiz. Eğer izin verirse bu konum bilgisine erişim ilgili konumu başlangıç noktası yapacağız. Eğer vermesi varsayılan bir konum belirle */

// Global degiskenler.

let clickedCords;
let layer;
// ! Localstorageden gelen verileri javascript nesnesine cevir ama eger localstroge bossa boz bir dizi render et
let notes = JSON.parse(localStorage.getItem("notes")) || [];

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
  var map = L.map("map", { zoomControl: false }).setView(currentPosition, 10);

  //Harita kurulumu Haritanin ekranda render edilmesini saglar
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  //Ekrana basilacak isaretlerin listelenecegi bir katman olustur.

  layer = L.layerGroup().addTo(map);

  //Zoom butonlarini ekranin sag asagisina tasi

  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(map);

  //Imlec ekle
  L.marker(currentPosition, { icon: personIcon }).addTo(map).bindPopup(msg);

  //Haritaya tiklanma ol,ayi gerceklesince

  map.on("click", onMapClick);

  //Haritaya notlari render et

  renderMakers();
  renderNotes();
}

//! Harika tiklanma olayini izle

function onMapClick(e) {
  // Tiklanilma Olayi
  // alert("Tiklandi");

  clickedCords = [e.latlng.lat, e.latlng.lng];

  ui.aside.classList.add("add");
}

//Iptal Butonuna tiklayinca Asideyi tekrar eski haline ceviren fonk

ui.cancelBtn.addEventListener("click", () => {
  //Aside a eklenen "add" classini kaldir.
  ui.aside.classList.remove("add");
});

//Formun gonderilme olayini izle
ui.form.addEventListener("submit", (e) => {
  //Sayfa yenilemei engelle
  e.preventDefault();

  const title = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  console.log(title);
  console.log(date);
  console.log(status);

  //Bir not objesi olusturmak

  const newNote = {
    //1970 itibaren gecen zamanin millisaniye cinsinden degerini aldik
    id: new Date().getTime(),
    title,
    date,
    status,
    coords: clickedCords,
  };

  //Notlar dizisini guncelle yeni notu ekle
  //Localstroge guncelle
  //push kullanilabilir ilgili note dizisinin sonuna ekler
  //unshift en basa getirir yeni elemani
  notes.unshift(newNote);

  // Localstorage ilgili elemani ekle
  localStorage.setItem("notes", JSON.stringify(notes));

  //Aside eski haline cevir
  ui.aside.classList.remove("add");

  //Formun icerigini temizle

  // title.value = "";
  e.target.reset();

  //Notlari render etsin
  renderNotes();
  renderMakers();
});

function renderMakers() {
  //Her not icin bir marker olustur
  notes.map((note) => {
    const icon = getIcon(note.status);
    //Her not icin bir marker olstur
    L.marker(note.coords, { icon }).addTo(layer).bindPopup(note.title);
  });
}

//! Noteleri render eden fonk

function renderNotes() {
  const noteCards = notes
    .map((note) => {
      const date = new Date(note.date).toLocaleString("tr");

      const status = getStatus(note.stat);
      return `<li>
        <div>
          <p>${note.title}</p>
          <p>${date}</p>
          <p>${status}</p>
        </div>
        <div class="icons">
          <i dataset-id='${note.id}' class="bi bi-airplane-fill" id="fly"></i>
          <i dataset-id='${note.id}' class="bi bi-trash-fill" id="trash"></i>
        </div>
      </li>`;
    })
    .join("");

  ui.ul.innerHTML = noteCards;
}
