import {verify} from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function GET(request,response) {
  try {
    // Convierte los valores de `_parsed` en un array de objetos
    const cookiesArray = Array.from(request.cookies._parsed.values());
    
    // Extrae el valor de la cookie "session_token"
    const token = cookiesArray.find(cookie => cookie.name === 'session_token')?.value;

    const userToken = verify(token,process.env.JWT_SECRET);

    return NextResponse.json({
      exp: userToken.exp,
      id: userToken.id,
      email: userToken.email,
      iat: userToken.iat
    });
  } catch (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
