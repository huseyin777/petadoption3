import { useLoaderData, useNavigate } from "react-router-dom";
import "./singlePage.scss";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import Slider from "../../components/slider/Slider";
import { io } from "socket.io-client";

const SinglePostPage = () => {
  const data = useLoaderData();
  const navigate = useNavigate();

  // API'den gelen verileri düzgün çek
  const post = data || {};
  const { postDetail, user } = post;

  const { currentUser } = useContext(AuthContext);
  const [saved, setSaved] = useState(post.isSaved ?? false);
  const [messageText, setMessageText] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);

  // WebSocket bağlantısı
  const socket = io("http://localhost:8800");

  useEffect(() => {
    return () => {
      socket.disconnect(); // Sayfa değiştiğinde socket bağlantısını kapat
    };
  }, []);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.error("Save error:", err);
      setSaved((prev) => !prev);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser.id === user?.id) {
      alert("You cannot send a message to yourself!");
      return;
    }
    if (!messageText.trim()) return;
    if (!user || !user.id) {
      alert("Error: The recipient user data is missing.");
      return;
    }

    try {
      // 1️⃣ Chat var mı kontrol et, yoksa yeni chat başlat
      const chatRes = await apiRequest.post("/chats", {
        receiverId: user.id,
      });

      // 2️Mesajı kaydet
      const messageRes = await apiRequest.post(`/messages/${chatRes.data.id}`, {
        text: messageText,
      });

      // 3️⃣ WebSocket ile mesajı alıcıya ilet
      socket.emit("sendMessage", {
        receiverId: user.id,
        data: {
          ...messageRes.data,
          chatId: chatRes.data.id,
          userId: currentUser.id,
          createdAt: new Date().toISOString(),
        },
      });

      setShowMessageModal(false);
      setMessageText("");
    } catch (err) {
      console.error("Message send error:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="singlePostPage">
      <div className="details">
        <div className="wrapper">
          <button onClick={() => navigate(-1)} className="backButton">
            &lt; Back
          </button>

          {/* Kullanıcı bilgileri */}
          <div className="authorInfo">
            <img src={user?.avatar} alt="User avatar" className="avatar" />
            <span>{user?.username}</span>
          </div>

          {/* Fotoğraf Galerisi */}
          {post.images?.length > 0 && <Slider images={post.images} />}

          {/* Temel Bilgiler */}
          <div className="section">
            <h1>{post.title}</h1>
            <div className="infoGrid">
              <div className="infoItem">
                <span>Type:</span> <span>{post.type}</span>
              </div>
              <div className="infoItem">
                <span>Breed:</span> <span>{post.breed}</span>
              </div>
              <div className="infoItem">
                <span>Age:</span> <span>{post.age} years</span>
              </div>
              <div className="infoItem">
                <span>Location:</span>{" "}
                <span>
                  {post.address}, {post.city}
                </span>
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="buttons">
            <button onClick={() => setShowMessageModal(true)}>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              style={{ backgroundColor: saved ? "#fece51" : "white" }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>

          {/* Açıklama */}
          <div className="section">
            <h2>Description</h2>
            <div
              className="description"
              dangerouslySetInnerHTML={{ __html: postDetail?.description }}
            />
          </div>

          {/* Sağlık Durumu */}
          <div className="section">
            <h2>Health Status</h2>
            <div className="healthStatus">
              {post.healthStatus?.map((status, index) => (
                <span key={index} className="statusTag">
                  {status.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
          <div className="detailsGrid">
            {postDetail && (
              <>
                <div className="detailItem">
                  <h3>Behavior</h3>
                  <p>{postDetail.behavior}</p>
                </div>
                <div className="detailItem">
                  <h3>Interaction with Others</h3>
                  <p>{postDetail.interaction}</p>
                </div>
                <div className="detailItem">
                  <h3>Training Status</h3>
                  <p>{postDetail.trainingStatus}</p>
                </div>
                <div className="detailItem">
                  <h3>Care Requirements</h3>
                  <p>{postDetail.careRequirements}</p>
                </div>
                <div className="detailItem">
                  <h3>Adoption Requirements</h3>
                  <p>{postDetail.adoptionRequirements}</p>
                </div>
                {postDetail.medicalHistory && (
                  <div className="detailItem">
                    <h3>Medical History</h3>
                    <p>{postDetail.medicalHistory}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Konum Bilgisi */}
          <div className="section">
            <p className="title">Location</p>
            <div className="mapContainer">
              <iframe
                title="locationMap"
                width="100%"
                height="300"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://maps.google.com/maps?q=${post.latitude},${post.longitude}&z=15&output=embed`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mesaj Gönderme Modal'ı */}
      {showMessageModal && (
        <div className="messageModal">
          <div className="modalContent">
            <h2>Send a Message</h2>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Write your message..."
            ></textarea>
            <div className="modalButtons">
              <button onClick={handleSendMessage}>Send</button>
              <button onClick={() => setShowMessageModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePostPage;
