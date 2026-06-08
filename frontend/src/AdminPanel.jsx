import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "./firebase";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Credenciales incorrectas. Verificá tu email y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ap-login-wrap">
      <div className="ap-login-card">
        <div className="ap-login-mark">L</div>

        <p className="ap-login-eyebrow">Panel de administración</p>
        <p className="ap-login-heading">Acceso restringido</p>

        <form onSubmit={handleSubmit}>
          <div className="ap-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@inmobiliaria.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="ap-field">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button className="ap-login-btn" type="submit" disabled={loading}>
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>

        {error && <p className="ap-login-error">{error}</p>}
      </div>
    </div>
  );
}

function LeadsTable() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLeads(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="ap-dashboard">
      <div className="ap-header">
        <div>
          <span className="ap-header-eyebrow">Panel de administración</span>
          <div className="ap-header-title">
            Leads
            <span className="ap-badge">
              <span className="ap-live-dot" />
              {leads.length}
            </span>
          </div>
        </div>
        <button className="ap-logout-btn" onClick={() => signOut(auth)}>
          Cerrar sesión
        </button>
      </div>

      {leads.length === 0 ? (
        <div className="ap-empty">No hay leads registrados todavía.</div>
      ) : (
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Presupuesto</th>
                <th>Mensaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr key={lead.id} style={{ animationDelay: `${i * 0.04}s` }}>
                  <td className="td-name">{lead.nombre}</td>
                  <td>{lead.email}</td>
                  <td>{lead.telefono || "—"}</td>
                  <td className="td-budget">{lead.presupuesto || "—"}</td>
                  <td className="td-msg">{lead.mensaje}</td>
                  <td className="td-date">
                    {lead.createdAt?.toDate?.().toLocaleDateString("es-AR") ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const [user, setUser] = useState(undefined); // undefined = checking auth

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  if (user === undefined) {
    return (
      <div className="ap-page">
        <div className="ap-loading">
          <span className="ap-loading-dot" />
          Verificando sesión
        </div>
      </div>
    );
  }

  return (
    <div className="ap-page">
      {!user ? <LoginForm /> : <LeadsTable user={user} />}
    </div>
  );
}
