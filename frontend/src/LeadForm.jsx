import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

const PRESUPUESTO_OPTS = [
  "Hasta $50.000.000",
  "$50.000.000 – $100.000.000",
  "$100.000.000 – $200.000.000",
  "$200.000.000 – $500.000.000",
  "Más de $500.000.000",
];

export default function LeadForm() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    presupuesto: "",
    mensaje: "",
  });
  const [status, setStatus] = useState(null); // null | "loading" | "ok" | "error"

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
      setForm({ nombre: "", email: "", telefono: "", presupuesto: "", mensaje: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="lf-page">
      <div className="lf-card">

        {/* ── Brand panel ── */}
        <div className="lf-brand">
          <span className="lf-tag">Captación de Leads</span>

          <h1 className="lf-title">
            Encontrá<br />tu próxima<br /><em>propiedad.</em>
          </h1>

          <p className="lf-desc">
            Completá el formulario y uno de nuestros asesores te
            contacta en menos de 24 horas.
          </p>

          {/* Architectural floor plan watermark */}
          <svg className="lf-deco" width="148" height="104" viewBox="0 0 148 104" fill="none">
            <rect x="0.4" y="0.4" width="147.2" height="103.2" stroke="currentColor" strokeWidth="0.7"/>
            <line x1="0" y1="38" x2="92" y2="38" stroke="currentColor" strokeWidth="0.5"/>
            <line x1="92" y1="0" x2="92" y2="68" stroke="currentColor" strokeWidth="0.5"/>
            <line x1="92" y1="68" x2="148" y2="68" stroke="currentColor" strokeWidth="0.5"/>
            <line x1="42" y1="38" x2="42" y2="104" stroke="currentColor" strokeWidth="0.5"/>
            <line x1="120" y1="0" x2="120" y2="68" stroke="currentColor" strokeWidth="0.4"/>
            <path d="M92 50 Q82 50 82 60" stroke="currentColor" strokeWidth="0.6" fill="none"/>
            <line x1="8" y1="115" x2="140" y2="115" stroke="currentColor" strokeWidth="0.4" strokeDasharray="4 4"/>
          </svg>
        </div>

        {/* ── Form panel ── */}
        <div className="lf-form-panel">
          <p className="lf-form-eyebrow">Nueva consulta</p>
          <p className="lf-form-subtitle">
            Los campos marcados con * son obligatorios.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="lf-field">
              <label className="lf-label">Nombre completo *</label>
              <input
                name="nombre"
                placeholder="Ej: María González"
                value={form.nombre}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className="lf-row">
              <div className="lf-field">
                <label className="lf-label">Email *</label>
                <input
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="lf-field">
                <label className="lf-label">Teléfono</label>
                <input
                  name="telefono"
                  type="tel"
                  placeholder="+54 9 11 0000-0000"
                  value={form.telefono}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="lf-field">
              <label className="lf-label">Presupuesto</label>
              <div className="lf-select-wrap">
                <select
                  name="presupuesto"
                  value={form.presupuesto}
                  onChange={handleChange}
                >
                  <option value="">Seleccioná un rango</option>
                  {PRESUPUESTO_OPTS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="lf-field">
              <label className="lf-label">Mensaje *</label>
              <textarea
                name="mensaje"
                placeholder="¿Qué estás buscando? Zona, ambientes, tipo de propiedad..."
                value={form.mensaje}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>

            <button
              className="lf-submit"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Enviando..." : "Enviar consulta"}
            </button>
          </form>

          {status === "ok" && (
            <div className="lf-status ok">
              Consulta recibida — te contactamos en las próximas 24 horas.
            </div>
          )}
          {status === "error" && (
            <div className="lf-status error">
              Hubo un error al enviar. Intentá de nuevo.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
