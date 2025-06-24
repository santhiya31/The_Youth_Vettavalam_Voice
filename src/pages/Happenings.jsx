import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion";
import { deleteDoc, doc } from "firebase/firestore";


const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const storage = getStorage();

function Happenings() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(data);
  };

  const handleDelete = async (id) => {
  try {
    await deleteDoc(doc(db, "posts", id));
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  } catch (err) {
    console.error("Error deleting post:", err);
    alert("Failed to delete ❌");
  }
};

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFilePreview("");
    }
  };



const handlePost = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let fileURL = "";
    let fileType = "";

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
      fileType = file.type;
    }

    const newPost = {
      title,
      description,
      fileURL,
      fileType,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "posts"), newPost);
    setPosts((prevPosts) => [{ id: docRef.id, ...newPost }, ...prevPosts]);
    fetchPosts();

    setTitle("");
    setDescription("");
    setFile(null);
    setFilePreview("");
    setShowForm(false);
  } catch (error) {
    console.error("Upload error:", error);
    alert("Error uploading post ❌");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Community Feed</h2>

      <button onClick={() => setShowForm(true)} style={styles.postButton}>
        Post Something
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={styles.modal}
          >
            <h3 style={{ marginBottom: "1rem" }}>Create a New Post</h3>
            <form onSubmit={handlePost} style={styles.form}>
              <input
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={styles.input}
              />
              <textarea
                placeholder="What's happening..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={styles.textarea}
              ></textarea>

              <input
                type="file"
                onChange={handleFileChange}
                style={styles.input}
                accept="image/*,video/*,.pdf,.doc,.docx"
              />

              {filePreview && (
                <img
                  src={filePreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}

              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" style={styles.button} disabled={loading}>
                  {loading ? "Posting..." : "Submit"}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFile(null);
                    setFilePreview("");
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.feed}>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={styles.card}
          >
            <h3 style={styles.title}>{post.title}</h3>
            <p style={styles.description}>{post.description}</p>

            {post.fileURL && post.fileType?.startsWith("image/") && (
              <img
                src={post.fileURL}
                alt="uploaded"
                style={{
    width: "100%",maxHeight: "400px", objectFit: "contain", borderRadius: "8px",
  }}
              />
            )}

            {post.fileURL && post.fileType?.startsWith("video/") && (
              <video
                src={post.fileURL}
                controls
                style={{ width: "100%", marginTop: "0.5rem", borderRadius: "8px" }}
              ></video>
            )}

            {post.fileURL &&
              !post.fileType?.startsWith("image/") &&
              !post.fileType?.startsWith("video/") && (
                <a
                  href={post.fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: "0.5rem",
                    display: "block",
                    color: "#2c3e50",
                    fontWeight: "bold",
                  }}
                >
                  📄 View Document
                </a>
              )}
              <button
      onClick={() => handleDelete(post.id)}
      style={{
        backgroundColor: "#e74c3c",color: "white",border: "none",borderRadius: "4px",padding: "0.4rem 0.8rem",marginTop: "0.5rem",cursor: "pointer",
      }}
    >
      🗑 Delete
    </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "800px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  postButton: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "1rem",
    fontSize: "1rem",
  },
  modal: {
    backgroundColor: "#f9f9f9",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    marginBottom: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.7rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "0.7rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    height: "100px",
  },
  button: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  feed: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "0.5rem",
    color: "#2c3e50",
  },
  description: {
    color: "#555",
  },
};

export default Happenings;
