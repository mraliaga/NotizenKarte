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
    // 1970'den itibaren geçen zamanın milisaniye cinsinden değerini aldık
    id: new Date().getTime(),
    title,
    date,
    status,
    coords: clickedCords,
  };

  // Notlar dizisini yeni notu ekle
  notes.unshift(newNote);
  // Localstorage'ı güncelle
  localStorage.setItem("notes", JSON.stringify(notes));

  // Aside'ı eski haline çevir
  ui.aside.classList.remove("add");

  // Formun içeriğini temizle
  e.target.reset();

  // Notları render et
  renderNotes();
  renderMakers();
});

function renderMakers() {
  // Haritadak markerları temizle
  layer.clearLayers();
  // Notlar içindeki her bir öğe için bir işaretçi ekle
  notes.map((note) => {
    const icon = getIcon(note.status);
    // Her not için bir marker oluştur
    L.marker(note.coords, { icon }).addTo(layer).bindPopup(note.title);
  });
}

// ! Notları render eden fonksiyon

function renderNotes() {
  const noteCards = notes
    .map((note) => {
      // Tarih verisi istenilen formatta düzenlendi
      const date = new Date(note.date).toLocaleString("tr", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const status = getStatus(note.status);

      return `<li>
          <div>
            <p>${note.title}</p>
            <p>${date}</p>
          
            <p>${status}</p>
          </div>
          <div class="icons">
            <i data-id="${note.id}" class="bi bi-airplane-fill" id="fly"></i>
            <i data-id="${note.id}" class="bi bi-trash-fill" id="delete"></i>
          </div>
        </li>`;
    })
    .join("");

  // Oluşturulan kart elemanlarını HTML kısmına ekle
  ui.ul.innerHTML = noteCards;
  // Delete Iconlarına tıklanınca silme işlemini gerçekleştir
  document.querySelectorAll("li #delete").forEach((btn) => {
    const id = btn.dataset.id;

    btn.addEventListener("click", () => {
      deleteNote(id);
    });
  });

  document.querySelectorAll("#li #fly").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = +btn.dataset.id;

      flyToNote(id);
    });
  });
}

// ! Not silme fonksiyonu
function deleteNote(id) {
  // Kullanıcıdan silme işlemi için onay al
  const res = confirm("Not silme işlemini onaylıyor musunuz ?");

  if (res) {
    // `id`'si bilinen elemanı notes dizisinden kaldır
    notes = notes.filter((note) => note.id !== parseInt(id));

    // LocalStorage'ı güncelle
    localStorage.setItem("notes", JSON.stringify(notes));

    // Notları render et
    renderNotes();

    // Markerları render et
    renderMakers();
  }
}

//notlara fokslanma fonk
function flyToNote(id) {
  const foundedNote = notes.find((note) => note.id == id);

  map.flyTo(foundedNote.coords, 12);
}

//arrow after click

elements.arrowIcon.addEventListener("click", () => {
  elements.aside.classList.toggle("hide");
});
