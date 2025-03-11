import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/uploadWidget.jsx";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [healthStatus, setHealthStatus] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to disable button
  const navigate = useNavigate();

  const handleHealthStatusChange = (status) => {
    setHealthStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent duplicate requests

    setIsSubmitting(true); // Disable button

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          address: inputs.address,
          city: inputs.city,
          type: inputs.type,
          age: parseInt(inputs.age),
          images: images,
          breed: inputs.breed,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          healthStatus: healthStatus,
        },
        postDetail: {
          behavior: inputs.behavior,
          interaction: inputs.interaction,
          trainingStatus: inputs.trainingStatus,
          careRequirements: inputs.careRequirements,
          adoptionRequirements: inputs.adoptionRequirements,
          description: description,
          medicalHistory: inputs.medicalHistory,
        },
      });

      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Pet for Adoption</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="item">
              <label htmlFor="title">Pet Name</label>
              <input id="title" name="title" type="text" required />
            </div>

            <div className="item">
              <label htmlFor="type">Animal Type</label>
              <select name="type" required>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="fish">Fish</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="breed">Breed</label>
              <input id="breed" name="breed" type="text" required />
            </div>

            <div className="item">
              <label htmlFor="age">Age (years)</label>
              <input
                id="age"
                name="age"
                type="number"
                min="0"
                max="30"
                required
              />
            </div>

            {/* Location Information */}
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>

            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" required />
            </div>

            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" required />
            </div>

            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" required />
            </div>

            {/* Health Information */}
            <div className="item health-status">
              <label>Health Status</label>
              {Object.values(HealthStatusEnum).map((status) => (
                <label key={status} className="checkbox">
                  <input
                    type="checkbox"
                    checked={healthStatus.includes(status)}
                    onChange={() => handleHealthStatusChange(status)}
                  />
                  {status.replace(/_/g, " ")}
                </label>
              ))}
            </div>

            {/* Post Details */}
            <div className="item description">
              <label>Pet Description</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
              />
            </div>

            <div className="item">
              <label htmlFor="behavior">Behavior</label>
              <textarea id="behavior" name="behavior" required />
            </div>

            <div className="item">
              <label htmlFor="interaction">Interaction with Others</label>
              <textarea id="interaction" name="interaction" required />
            </div>

            <div className="item">
              <label htmlFor="trainingStatus">Training Status</label>
              <input
                id="trainingStatus"
                name="trainingStatus"
                type="text"
                required
              />
            </div>

            <div className="item">
              <label htmlFor="careRequirements">Care Requirements</label>
              <textarea
                id="careRequirements"
                name="careRequirements"
                required
              />
            </div>

            <div className="item">
              <label htmlFor="adoptionRequirements">
                Adoption Requirements
              </label>
              <textarea
                id="adoptionRequirements"
                name="adoptionRequirements"
                required
              />
            </div>

            <div className="item">
              <label htmlFor="medicalHistory">Medical History</label>
              <textarea id="medicalHistory" name="medicalHistory" />
            </div>

            {/* Submit Button */}
            <button className="sendButton" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="loadingSpinner"></div>
              ) : (
                "Create Post"
              )}
            </button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="sideContainer">
        <div className="imageList">
          {images.map((image, index) => (
            <img src={image} key={index} alt={`Upload ${index + 1}`} />
          ))}
        </div>
        <div className="uploadButtonContainer">
          <UploadWidget
            uwConfig={{
              multiple: true,
              cloudName: "dbbhemucj",
              uploadPreset: "deneme",
              folder: "pet-images",
              allowedFormats: ["jpg", "jpeg", "png"],
            }}
            setState={setImages}
          />
        </div>
      </div>
    </div>
  );
}

// Helper for health status enum
const HealthStatusEnum = {
  UP_TO_DATE: "UP_TO_DATE",
  VACCINATED: "VACCINATED",
  SPAYED_NEUTERED: "SPAYED_NEUTERED",
  HEALTH_ISSUES: "HEALTH_ISSUES",
  NO_HEALTH_ISSUES: "NO_HEALTH_ISSUES",
};

export default NewPostPage;
