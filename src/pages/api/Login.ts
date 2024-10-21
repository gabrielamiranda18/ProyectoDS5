import type { APIRoute } from "astro";
import { supabase } from "../../lib/database";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener los datos del formulario
    const formData = await request.formData();
    const correo = formData.get("email")?.toString() || "";
    const password = formData.get("contraseña")?.toString() || "";

    if (!correo || !password) {
      return new Response(
        JSON.stringify({ message: "Faltan datos del formulario" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Iniciar sesión utilizando Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password,
    });

    if (authError || !authData.session) {
      return new Response(
        JSON.stringify({ message: "Usuario o contraseña incorrectos" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Aquí puedes extraer el ID del usuario autenticado
    const { user } = authData.session;
    
    // Obtener el tipo de usuario según el correo (puedes guardar esto en la base de datos para más control)
    const tipoUsuario = correo.endsWith("@jselectronics.org") ? "/contacto" : "/Layout";

    // Enviar la respuesta con redirección al frontend
    return new Response(
      JSON.stringify({ redirectTo: tipoUsuario }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Error en la API de inicio de sesión:", err);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
