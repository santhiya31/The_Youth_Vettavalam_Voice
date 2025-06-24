import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Department → Official website mapping:
const departmentLinks = {
  "Municipality": "https://municipality-website.com",
  "Police": "https://police-complaints.com",
  "Electricity Board": "https://electricity-complaints.com",
  "Water Supply": "https://watersupply-complaints.com",
  "Other": "https://general-complaints.com",
};

function Complaint() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
        email,
        department,
        complaint,
        fileURL,
        createdAt: Timestamp.now(),
      });

      alert("Complaint submitted ✅");
      setName("");
      setEmail("");
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
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Submit a Complaint</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
          {Object.keys(departmentLinks).map((dep) => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>

        <textarea
          placeholder="Write your complaint..."
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          required
          rows="4"
        ></textarea>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*,video/*,.pdf,.doc,.docx"
        />

        <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem" }}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>

      <button
        onClick={() => window.open(departmentLinks[department], "_blank")}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#555", color: "white" }}
      >
        Go to {department} Official Site
      </button>
    </div>
  );
}

export default Complaint;
