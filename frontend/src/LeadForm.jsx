import { useState } from "react";

const BACKEND_URL = "http://localhost:8000";

export default function LeadForm() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
    presupuesto: "",
  });
  const [status, setStatus] = useState(null); // "loading" | "ok" | "error"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${BACKEND_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error del servidor");
      setStatus("ok");
      setForm({ nombre: "", email: "", telefono: "", mensaje: "", presupuesto: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="form-container">
      <h1>Encontrá tu propiedad ideal</h1>
      <p>Completá el formulario y te contactamos a la brevedad.</p>

      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="telefono"
          type="tel"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
        />
        <input
          name="presupuesto"
          placeholder="Presupuesto (ej: $50.000.000)"
          value={form.presupuesto}
          onChange={handleChange}
        />
        <textarea
          name="mensaje"
          placeholder="¿Qué estás buscando? Zona, ambientes, tipo de propiedad..."
          value={form.mensaje}
          onChange={handleChange}
          rows={4}
          required
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Enviando..." : "Enviar consulta"}
        </button>
      </form>

      {status === "ok" && (
        <p className="msg-ok">¡Consulta enviada! Te contactamos pronto.</p>
      )}
      {status === "error" && (
        <p className="msg-error">Hubo un error. Intentá de nuevo.</p>
      )}
    </div>
  );
}
