import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;



function Complaint() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Municipality");
  const [complaint, setComplaint] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let fileURL = "";

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        fileURL = data.secure_url;
      }

      await addDoc(collection(db, "complaints"), {
        name,
        phone,
        department,
        complaint,
        fileURL,
        createdAt: Timestamp.now(),
      });

      alert("Complaint submitted ✅");
      setName("");
      setPhone("");
      setComplaint("");
      setFile(null);
      setDepartment("Municipality");
    } catch (error) {
      console.error(error);
      alert("Error submitting complaint ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div style={{
    padding: "2rem",
    maxWidth: "600px",
    margin: "2rem auto",
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
    borderRadius: "12px"
  }}>
    <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#4A148C", fontSize: "1.8rem" }}>
      📝 Submit a Complaint
    </h2>
<form
  onSubmit={handleSubmit}
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
    marginTop: "1rem"
  }}
>
  <input
    type="text"
    placeholder="Your Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    style={formInputStyle}
  />

  <input
    type="tel"
    placeholder="Your Phone Number"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    pattern="[0-9]{10}"
    required
    style={formInputStyle}
  />

  <select
    value={department}
    onChange={(e) => setDepartment(e.target.value)}
    required
    style={{ ...formInputStyle, backgroundColor: "#f5f5f5" }}
  >
    <option value="">-- Select Department --</option>
    <option value="Police">Police</option>
    <option value="Municipality">Municipality</option>
    <option value="Electricity Board">Electricity Board</option>
    <option value="Water Supply">Water Supply</option>
    <option value="Revenue Department">Revenue Department</option>
    <option value="Health Department">Health Department</option>
    <option value="Public Works">Public Works</option>
    <option value="Transport">Transport</option>
    <option value="Other">Other</option>
  </select>

  <textarea
    placeholder="Write your complaint..."
    value={complaint}
    onChange={(e) => setComplaint(e.target.value)}
    required
    rows="4"
    style={{
      ...formInputStyle,
      resize: "vertical",
      lineHeight: "1.5",
      backgroundColor: "#fafafa"
    }}
  ></textarea>

  <input
    type="file"
    onChange={(e) => setFile(e.target.files[0])}
    accept="image/*,video/*,.pdf,.doc,.docx"
    style={{
      ...formInputStyle,
      padding: "0.6rem",
      cursor: "pointer",
      backgroundColor: "#fff"
    }}
  />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.75rem 1rem",
          backgroundColor: "#7B1FA2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "background-color 0.3s"
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#6A1B9A")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#7B1FA2")}
      >
        {loading ? "Submitting..." : "📨 Submit Complaint"}
      </button>
    </form>

    <button
      onClick={() => window.open("https://pgportal.gov.in/", "_blank")}
      style={{
        marginTop: "1.5rem",
        padding: "0.6rem 1rem",
        backgroundColor: "#512DA8",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontWeight: "bold",
        width: "100%",
        fontSize: "1rem",
        cursor: "pointer"
      }}
    >
      🌐 Go to CPGRAMS Official Portal
    </button>
  </div>
);

}


const formInputStyle = {
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: "1.5px solid #ccc",
  color: "#333",
  fontSize: "1rem",
  outline: "none",
  backgroundColor: "#fefefe",
  transition: "border-color 0.3s",
};




export default Complaint;
