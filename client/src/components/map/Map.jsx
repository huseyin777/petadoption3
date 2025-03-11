import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import L from "leaflet";
import Pin from "../pin/Pin";
import "./map.scss";
import "leaflet/dist/leaflet.css";

const pinIcon = new L.Icon({
  iconUrl: "/pin.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const normalizeCityName = (city) => {
  return city
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ /g, "")
    .replace(/'/g, "")
    .replace(/ğ/g, "g");
};

const cityToCoordinates = (inputCity) => {
  const cities = {
    // İller (Normalize edilmiş isimlerle)
    adana: { lat: 37.0, lon: 35.3213 },
    adiyaman: { lat: 37.7648, lon: 38.2786 },
    afyonkarahisar: { lat: 38.7631, lon: 30.5527 },
    agri: { lat: 39.7191, lon: 43.0503 },
    aksaray: { lat: 38.3687, lon: 34.037 },
    amasya: { lat: 40.6565, lon: 35.837 },
    ankara: { lat: 39.9208, lon: 32.8541 },
    antalya: { lat: 36.8841, lon: 30.7056 },
    ardahan: { lat: 41.1105, lon: 42.7022 },
    artvin: { lat: 41.1828, lon: 41.8183 },
    aydin: { lat: 37.8481, lon: 27.8456 },
    balikesir: { lat: 39.6484, lon: 27.8826 },
    bartin: { lat: 41.6344, lon: 32.3375 },
    batman: { lat: 37.8812, lon: 41.1351 },
    bayburt: { lat: 40.2552, lon: 40.2249 },
    bilecik: { lat: 40.1467, lon: 29.9811 },
    bingol: { lat: 38.8854, lon: 40.4986 },
    bitlis: { lat: 38.4, lon: 42.1086 },
    bolu: { lat: 40.7356, lon: 31.6061 },
    burdur: { lat: 37.7269, lon: 30.2889 },
    bursa: { lat: 40.1826, lon: 29.0669 },
    canakkale: { lat: 40.1553, lon: 26.4142 },
    cankiri: { lat: 40.6, lon: 33.6167 },
    corum: { lat: 40.55, lon: 34.95 },
    denizli: { lat: 37.7833, lon: 29.0947 },
    diyarbakir: { lat: 37.9144, lon: 40.2306 },
    duzce: { lat: 40.8434, lon: 31.1565 },
    edirne: { lat: 41.6771, lon: 26.555 },
    elazig: { lat: 38.68, lon: 39.2264 },
    erzincan: { lat: 39.75, lon: 39.5 },
    erzurum: { lat: 39.9086, lon: 41.2769 },
    eskisehir: { lat: 39.7767, lon: 30.5206 },
    gaziantep: { lat: 37.0662, lon: 37.3833 },
    giresun: { lat: 40.9167, lon: 38.4 },
    gumushane: { lat: 40.46, lon: 39.4833 },
    hakkari: { lat: 37.5833, lon: 43.7333 },
    hatay: { lat: 36.4018, lon: 36.3498 },
    igdir: { lat: 39.9167, lon: 44.0333 },
    isparta: { lat: 37.7648, lon: 30.5566 },
    istanbul: { lat: 41.0082, lon: 28.9784 },
    izmir: { lat: 38.4192, lon: 27.1287 },
    kahramanmaras: { lat: 37.5833, lon: 36.9333 },
    karabuk: { lat: 41.2, lon: 32.6333 },
    karaman: { lat: 37.1833, lon: 33.2167 },
    kars: { lat: 40.6167, lon: 43.1 },
    kastamonu: { lat: 41.3767, lon: 33.7764 },
    kayseri: { lat: 38.7312, lon: 35.4787 },
    kilis: { lat: 36.7167, lon: 37.1167 },
    kirikkale: { lat: 39.8417, lon: 33.5139 },
    kirklareli: { lat: 41.7333, lon: 27.2167 },
    kirsehir: { lat: 39.15, lon: 34.1667 },
    kocaeli: { lat: 40.8533, lon: 29.8815 },
    konya: { lat: 37.8713, lon: 32.4846 },
    kutahya: { lat: 39.4167, lon: 29.9833 },
    malatya: { lat: 38.3552, lon: 38.3095 },
    manisa: { lat: 38.6191, lon: 27.4289 },
    mardin: { lat: 37.3167, lon: 40.7333 },
    mersin: { lat: 36.8121, lon: 34.6415 },
    mugla: { lat: 37.2167, lon: 28.3667 },
    mus: { lat: 38.7333, lon: 41.4911 },
    nevsehir: { lat: 38.6267, lon: 34.7136 },
    nigde: { lat: 37.9667, lon: 34.6833 },
    ordu: { lat: 40.9862, lon: 37.8797 },
    osmaniye: { lat: 37.075, lon: 36.25 },
    rize: { lat: 41.0208, lon: 40.5219 },
    sakarya: { lat: 40.7833, lon: 30.4 },
    samsun: { lat: 41.2867, lon: 36.33 },
    sanliurfa: { lat: 37.1591, lon: 38.7969 },
    siirt: { lat: 37.9333, lon: 41.95 },
    sinop: { lat: 42.0267, lon: 35.1511 },
    sivas: { lat: 39.7477, lon: 37.0179 },
    sirnak: { lat: 37.5167, lon: 42.4667 },
    tekirdag: { lat: 40.978, lon: 27.511 },
    tokat: { lat: 40.3167, lon: 36.55 },
    trabzon: { lat: 41.0053, lon: 39.7267 },
    tunceli: { lat: 39.1072, lon: 39.5467 },
    usak: { lat: 38.6833, lon: 29.4 },
    van: { lat: 38.5012, lon: 43.3726 },
    yalova: { lat: 40.65, lon: 29.2667 },
    yozgat: { lat: 39.8167, lon: 34.8 },
    zonguldak: { lat: 41.4564, lon: 31.7986 },
  };

  const normalizedInput = normalizeCityName(inputCity);
  return cities[normalizedInput] || { lat: 39.9334, lon: 32.8597 }; // Türkiye merkezi
};

function Map({ items }) {
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city") || "";
  const [center, setCenter] = useState({ lat: 39.9334, lon: 32.8597 }); // Türkiye merkez

  useEffect(() => {
    if (city) {
      setCenter(cityToCoordinates(city));
    }
  }, [city]);

  return (
    <MapContainer
      center={[center.lat, center.lon]}
      zoom={5}
      scrollWheelZoom={false}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Eğer şehir seçildiyse oraya pin ekle */}
      {city && (
        <Marker position={[center.lat, center.lon]} icon={pinIcon}>
          <Popup>{city}</Popup>
        </Marker>
      )}

      {/* Mevcut hayvanları göster */}
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
}

export default Map;
