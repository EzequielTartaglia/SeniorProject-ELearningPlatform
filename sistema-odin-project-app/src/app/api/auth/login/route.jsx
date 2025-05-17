import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import supabase from "@/utils/supabase/supabaseClient";

export async function POST(request, response) {
  try {
    // Traer desde el FrontEnd los datos del formulario de login
    const { email, password } = await request.json();

    // Consultar la base de datos con Supabase
    const { data: users, error } = await supabase
      .from('platform_users')
      .select('*')
      .eq('email', email)
      .eq('password', password);

    if (error) throw error;
    const userFound = users[0];

    if (userFound) {
      // Verificar si el usuario está baneado o bloqueado
      if (userFound.is_banned) {
        throw new Error('Este usuario está baneado.');
      }

      if (userFound.is_blocked) {
        throw new Error('Este usuario está bloqueado.');
      }

      // Generar el token de sesión
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 días de expiración
          id: userFound.id,
          email: userFound.email,
        },
        process.env.JWT_SECRET
      );

      const response = NextResponse.json({
        token,
      });

      response.cookies.set({
        name: 'session_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        path: '/',
      });

      // Actualizar el token en la base de datos con Supabase
      const { error: updateError } = await supabase
        .from('platform_users')
        .update({ token: token.toString() })
        .eq('email', email);

      if (updateError) throw updateError;

      return response;
    } else {
      throw new Error('Usuario y/o contraseña incorrectos');
    }
  } catch (error) {
    // Si hay algún error, devolver una respuesta con el mensaje de error y el estado 500
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
