import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LeadForm from "./LeadForm";
import AdminPanel from "./AdminPanel";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/">Inicio</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LeadForm />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
