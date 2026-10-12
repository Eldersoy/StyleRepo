"use client";

import { useState } from "react";

const TONOS = [
  { value: "elegante", label: "Elegante" },
  { value: "casual", label: "Casual" },
  { value: "divertido", label: "Divertido" },
  { value: "lujo", label: "Lujo" },
  { value: "minimalista", label: "Minimalista" },
];

export default function Home() {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    material: "",
    color: "",
    publico: "",
    caracteristicas: "",
    tono: "elegante",
  });
  const [resultado, setResultado] = useState("");
  const [modo, setModo] = useState<"ia" | "demo" | "">("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [copiado, setCopiado] = useState(false);

  function actualizar(campo: string, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function generar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResultado("");
    setCopiado(false);

    if (!form.nombre.trim() || !form.categoria.trim()) {
      setError("El nombre y la categoría del producto son obligatorios.");
      return;
    }

    setCargando(true);
    try {
      const res = await fetch("/api/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al generar.");
      setResultado(data.texto);
      setModo(data.modo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setCargando(false);
    }
  }

  async function copiar() {
    await navigator.clipboard.writeText(resultado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <main className="wrap">
      <header className="hero">
        <h1>
          Style<span>Scribe</span>
        </h1>
        <p>
          Descripciones de producto que venden, para tu tienda de ropa — en
          segundos y con IA.
        </p>
      </header>

      <div className="grid">
        <form className="card" onSubmit={generar}>
          <div className="field">
            <label>Nombre del producto *</label>
            <input
              value={form.nombre}
              onChange={(e) => actualizar("nombre", e.target.value)}
              placeholder="Ej. Vestido midi floral"
            />
          </div>

          <div className="field">
            <label>Categoría *</label>
            <input
              value={form.categoria}
              onChange={(e) => actualizar("categoria", e.target.value)}
              placeholder="Ej. vestidos de verano"
            />
          </div>

          <div className="row">
            <div className="field">
              <label>Material</label>
              <input
                value={form.material}
                onChange={(e) => actualizar("material", e.target.value)}
                placeholder="Ej. algodón orgánico"
              />
            </div>
            <div className="field">
              <label>Color</label>
              <input
                value={form.color}
                onChange={(e) => actualizar("color", e.target.value)}
                placeholder="Ej. verde oliva"
              />
            </div>
          </div>

          <div className="field">
            <label>Público objetivo</label>
            <input
              value={form.publico}
              onChange={(e) => actualizar("publico", e.target.value)}
              placeholder="Ej. mujeres de 25-40 que buscan comodidad"
            />
          </div>

          <div className="field">
            <label>Características destacadas</label>
            <textarea
              value={form.caracteristicas}
              onChange={(e) => actualizar("caracteristicas", e.target.value)}
              placeholder="Ej. bolsillos ocultos, tela transpirable, lavable a máquina"
              rows={3}
            />
          </div>

          <div className="field">
            <label>Tono</label>
            <select
              value={form.tono}
              onChange={(e) => actualizar("tono", e.target.value)}
            >
              {TONOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={cargando}>
            {cargando ? "Generando…" : "✨ Generar descripción"}
          </button>

          {error && <p className="error">{error}</p>}
        </form>

        <div className="card resultado">
          <div className="resultado-head">
            <h2>Resultado</h2>
            {modo && (
              <span className={`badge ${modo}`}>
                {modo === "ia" ? "IA real" : "Modo demo"}
              </span>
            )}
          </div>

          {resultado ? (
            <>
              <p className="texto">{resultado}</p>
              <button className="copiar" onClick={copiar}>
                {copiado ? "¡Copiado! ✓" : "Copiar texto"}
              </button>
            </>
          ) : (
            <p className="placeholder">
              Rellena los datos y pulsa <strong>Generar</strong>. La
              descripción aparecerá aquí lista para copiar y pegar en tu tienda.
            </p>
          )}
        </div>
      </div>

      <footer className="foot">
        <p>
          Modo demo activo si no hay API key configurada. Añade{" "}
          <code>OPENAI_API_KEY</code> para resultados con IA real.
        </p>
      </footer>
    </main>
  );
}
