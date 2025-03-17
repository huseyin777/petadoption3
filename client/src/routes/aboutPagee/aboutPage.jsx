import "./aboutpage.scss";

function AboutPage() {
  return (
    <div className="aboutPage">
      <div className="content">
        <h1>About Us</h1>
        <p>
          Welcome to our pet adoption platform! We are dedicated to helping pets
          find their forever homes. Our mission is to connect loving families
          with pets in need.
        </p>
        <div className="stats">
          <div className="stat">
            <h2>500+</h2>
            <p>Happy Adopters</p>
          </div>
          <div className="stat">
            <h2>100+</h2>
            <p>Partner Shelters</p>
          </div>
          <div className="stat">
            <h2>10+</h2>
            <p>Years of Service</p>
          </div>
        </div>
      </div>
      <div className="imageContainer">
        <img src="/about.jpg" alt="About Us" />
      </div>
    </div>
  );
}

export default AboutPage;
