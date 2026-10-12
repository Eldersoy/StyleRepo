// Núcleo de la app: construye el prompt y genera la descripción.
// Funciona en 2 modos:
//   1) Con API de OpenAI si existe OPENAI_API_KEY (resultados reales de IA)
//   2) Modo demo (sin API key) para probar la app al instante y gratis.

export type Tono =
  | "elegante"
  | "casual"
  | "divertido"
  | "lujo"
  | "minimalista";

export interface ProductInput {
  nombre: string;
  categoria: string;
  material?: string;
  color?: string;
  publico?: string;
  caracteristicas?: string;
  tono: Tono;
}

const TONOS: Record<Tono, string> = {
  elegante: "elegante y sofisticado",
  casual: "cercano, relajado y cotidiano",
  divertido: "fresco, juvenil y con energía",
  lujo: "exclusivo, premium y aspiracional",
  minimalista: "limpio, directo y sin adornos",
};

export function construirPrompt(p: ProductInput): string {
  const partes = [
    `Producto: ${p.nombre}`,
    `Categoría: ${p.categoria}`,
    p.material ? `Material: ${p.material}` : null,
    p.color ? `Color: ${p.color}` : null,
    p.publico ? `Público objetivo: ${p.publico}` : null,
    p.caracteristicas ? `Características: ${p.caracteristicas}` : null,
    `Tono deseado: ${TONOS[p.tono]}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `Eres un copywriter experto en moda y e-commerce. Escribe una descripción de producto atractiva y persuasiva para una tienda de ropa online.

Datos del producto:
${partes}

Instrucciones:
- Escribe en español.
- Entre 50 y 90 palabras.
- Despierta deseo de compra sin exagerar.
- Incluye una frase final tipo llamada a la acción.
- No inventes datos técnicos que no se hayan dado.
- Devuelve solo la descripción, sin títulos ni comillas.`;
}

// Genera un resultado localmente, sin IA externa. Útil como demo gratis.
export function generarDemo(p: ProductInput): string {
  const tono = TONOS[p.tono];
  const detalles = [
    p.material ? `confeccionado en ${p.material}` : null,
    p.color ? `en un favorecedor tono ${p.color}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const publico = p.publico ? ` Pensado para ${p.publico},` : "";
  const extra = p.caracteristicas
    ? ` Destaca por: ${p.caracteristicas}.`
    : "";

  return `Descubre ${p.nombre}, la pieza de ${p.categoria} ${detalles} que redefine tu estilo con un aire ${tono}.${publico} combina comodidad y diseño para acompañarte en cualquier momento del día.${extra} Una elección que habla por ti sin decir una palabra. ✨ Añádela a tu carrito y haz que cada look cuente.`;
}

// Punto de entrada principal: decide IA real o demo.
export async function generarDescripcion(
  p: ProductInput
): Promise<{ texto: string; modo: "ia" | "demo" }> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return { texto: generarDemo(p), modo: "demo" };
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: construirPrompt(p) }],
        temperature: 0.8,
        max_tokens: 300,
      }),
    });

    if (!res.ok) {
      const detalle = await res.text();
      throw new Error(`OpenAI respondió ${res.status}: ${detalle}`);
    }

    const data = await res.json();
    const texto: string =
      data?.choices?.[0]?.message?.content?.trim() || generarDemo(p);

    return { texto, modo: "ia" };
  } catch (e) {
    // Si la IA falla, caemos al modo demo para no romper la experiencia.
    console.error("Fallo al llamar a OpenAI, usando demo:", e);
    return { texto: generarDemo(p), modo: "demo" };
  }
}
