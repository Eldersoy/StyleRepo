import { NextResponse } from "next/server";
import {
  generarDescripcion,
  type ProductInput,
  type Tono,
} from "@/lib/generator";

const TONOS_VALIDOS: Tono[] = [
  "elegante",
  "casual",
  "divertido",
  "lujo",
  "minimalista",
];

export async function POST(request: Request) {
  let body: Partial<ProductInput>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la petición no es JSON válido." },
      { status: 400 }
    );
  }

  if (!body.nombre || !body.categoria) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios: nombre y categoría." },
      { status: 400 }
    );
  }

  const tono: Tono = TONOS_VALIDOS.includes(body.tono as Tono)
    ? (body.tono as Tono)
    : "elegante";

  const input: ProductInput = {
    nombre: String(body.nombre).slice(0, 120),
    categoria: String(body.categoria).slice(0, 80),
    material: body.material ? String(body.material).slice(0, 80) : undefined,
    color: body.color ? String(body.color).slice(0, 60) : undefined,
    publico: body.publico ? String(body.publico).slice(0, 80) : undefined,
    caracteristicas: body.caracteristicas
      ? String(body.caracteristicas).slice(0, 300)
      : undefined,
    tono,
  };

  const resultado = await generarDescripcion(input);
  return NextResponse.json(resultado);
}
