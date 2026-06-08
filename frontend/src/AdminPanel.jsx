import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "./firebase";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <h2>Panel Admin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p className="msg-error">{error}</p>}
    </div>
  );
}

function LeadsTable({ user }) {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLeads(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Leads ({leads.length})</h2>
        <button onClick={() => signOut(auth)}>Cerrar sesión</button>
      </div>

      {leads.length === 0 ? (
        <p>No hay leads todavía.</p>
      ) : (
        <table>
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
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.nombre}</td>
                <td>{lead.email}</td>
                <td>{lead.telefono || "—"}</td>
                <td>{lead.presupuesto || "—"}</td>
                <td>{lead.mensaje}</td>
                <td>
                  {lead.createdAt?.toDate?.().toLocaleDateString("es-AR") ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  if (user === undefined) return <p>Cargando...</p>;
  if (!user) return <LoginForm />;
  return <LeadsTable user={user} />;
}
