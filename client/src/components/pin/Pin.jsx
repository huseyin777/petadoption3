import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "./pin.scss";

function Pin({ item }) {
  // Final validation check
  if (
    typeof item.latitude !== "number" ||
    typeof item.longitude !== "number" ||
    Math.abs(item.latitude) > 90 ||
    Math.abs(item.longitude) > 180
  ) {
    return null;
  }

  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popupContainer">
          {/* Image Section */}
          {item.images?.[0] && (
            <img
              src={item.images[0]}
              alt={item.name || "Pet image"}
              className="petImage"
            />
          )}

          {/* Text Info Section */}
          <div className="textContainer">
            <Link to={`/pets/${item.id}`} className="petLink">
              <h3>{item.name || "Unnamed Pet"}</h3>
            </Link>
            <p>{item.breed || "Unknown breed"}</p>
            <span>Age: {item.age || "Unknown"}</span>
            <b>{item.type?.toUpperCase() || "PET"}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
