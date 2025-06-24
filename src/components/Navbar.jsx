import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>The Young Vettavalam Voice</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/happenings" style={styles.link}>What's Happening</Link>
        <Link to="/complaint" style={styles.linkButton}>Submit Complaint</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#2c3e50",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 999,
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#f1c40f",
  },
  links: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
  },
  linkButton: {
    color: "#2c3e50",
    backgroundColor: "#f1c40f",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Navbar;
