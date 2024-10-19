import type { APIRoute } from "astro";
import { supabase } from "../../lib/database";
import { verifyPassword } from "../../lib/HPassword";  // Importamos la API de hash

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener los datos del formulario
    const formData = await request.formData();
    const correo = formData.get("email")?.toString() || "";
    const password = formData.get("contraseña")?.toString() || "";

    if (!correo || !password) {
      return new Response("Faltan datos del formulario", { status: 400 });
    }

    // Buscar al usuario en la base de datos por el correo
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("correo", correo)
      .single();

    if (error || !usuario) {
      return new Response("Usuario o contraseña incorrectos", { status: 401 });
    }

    // Llamar a la API de hash para verificar la contraseña
    const passwordMatch = await verifyPassword(password, usuario.password);

    if (!passwordMatch) {
      return new Response("Usuario o contraseña incorrectos", { status: 401 });
    }

    // Redirigir al usuario según su rol
    let tipoUsuario = correo.endsWith("@jselectronics.org") ? "/contacto" : "/Layout";

    return new Response(null, {
      status: 302,
      headers: {
        Location: tipoUsuario,
      },
    });

  } catch (err) {
    console.error("Error en la API de inicio de sesión:", err);
    return new Response("Error interno del servidor", { status: 500 });
  }
};
