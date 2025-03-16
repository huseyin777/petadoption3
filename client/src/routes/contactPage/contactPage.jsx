import { useState } from "react";
import "./contactPage.scss";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8800/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details || data.error || data.message || "Unknown error"
        );
      }

      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="contactPage">
      <div className="contactContainer">
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              onChange={handleChange}
              value={formData.name}
            />
          </div>
          <div className="formGroup">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              onChange={handleChange}
              value={formData.email}
            />
          </div>
          <div className="formGroup">
            <textarea
              name="message"
              placeholder="Your Message"
              required
              onChange={handleChange}
              value={formData.message}
            ></textarea>
          </div>
          <button type="submit" className="submitBtn">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
