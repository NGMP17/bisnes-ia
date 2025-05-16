import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const prompt = body.prompt || "Hola";

  // Simulación de respuesta de IA
  const respuesta = `Respuesta generada para: ${prompt}`;

  return NextResponse.json({ respuesta });
}
