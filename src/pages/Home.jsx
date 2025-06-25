function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.heading}>
          Welcome to <span style={{ color: "#f1c40f" }}>The Young Voices Of Vettavalam</span>
        </h1>
        <p style={styles.subheading}>
          Your voice matters. Report issues, share news, and stay connected with your community.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button style={styles.button} onClick={() => window.location.href = "/complaint"}>
            Raise Your Voice
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundImage: "url('/bg.png')",     
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    color: "white",
    padding: "2rem",
    textAlign: "center",
    borderRadius: "8px",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  subheading: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    maxWidth: "600px",
    margin: "0 auto 2rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "#f1c40f",
    color: "#2c3e50",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Home;


