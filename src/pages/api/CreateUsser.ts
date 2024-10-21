import type { APIRoute } from "astro";
import { supabase } from "../../lib/database";
import { hashPassword } from "../../lib/HPassword";

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    // Obtener los datos del formulario
    const formData = await request.formData();

    // Extraer los valores del formulario
    const nombre = formData.get("Nombre")?.toString() || "";
    const apellido = formData.get("Apellido")?.toString() || "";
    const direccion = formData.get("Direccion")?.toString() || "";
    const celular = formData.get("Celular")?.toString() || "";
    const correo = formData.get("Correo")?.toString() || "";
    const password = formData.get("Passw")?.toString() || "";
    let tipo_usuario: string | null = null;

    if (!password) {
      return new Response("Falta la contraseña", { status: 400 });
    }

    // Crear al usuario en Supabase Authentication
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: correo,
      password: password,
    });

    if (authError) {
      throw new Error("Error al crear el usuario en Auth: " + authError.message);
    }

    // Definir el tipo de usuario según el correo
    if (correo.endsWith("@jselectronics.org")) {
      tipo_usuario = "Empleado";
    } else {
      tipo_usuario = "Cliente";
    }

    // Hash de la contraseña para la tabla `usuarios`
    const hashedPassword = await hashPassword(password);

    // Insertar el nuevo usuario en la tabla `usuarios` con el `auth_user_id` obtenido
    const { error } = await supabase
      .from("usuarios")
      .insert([{ 
        user_id: authData.user?.id, // ID del usuario desde Auth
        nombre, 
        apellido, 
        correo, 
        password: hashedPassword, 
        direccion, 
        celular, 
        tipo_usuario 
      }]);

    if (error) {
      throw new Error("Error al crear el usuario: " + error.message);
    }

    // Redirigir a la página de inicio de sesión después de crear el usuario
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
      },
    });
  } catch (err) {
    console.error("Error en la API de creación de usuario:", err);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/CrearCuenta",
      },
    });
  }
};
