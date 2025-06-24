import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Complaint from "./pages/Complaint";
import Happenings from "./pages/Happenings";



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/happenings" element={<Happenings />} />
        
      </Routes>
    </>
  );
}

export default App;
