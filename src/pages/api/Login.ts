import type { APIRoute } from "astro";
import { supabase } from "../../lib/database";
import { hashPassword } from "../../lib/HPassword"; // Importar la función de hash de contraseña

// Función para validar la contraseña
function validarContraseña(password: string): boolean {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener los datos del formulario
    const formData = await request.formData();
    const correo = formData.get("Correo")?.toString() || "";
    const password = formData.get("Passw")?.toString() || "";

    // Validar la contraseña
    if (!validarContraseña(password)) {
      return new Response(
        JSON.stringify({ message: "La contraseña no cumple con los requisitos mínimos de seguridad." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear al usuario en Supabase Authentication
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: correo,
      password: password,
    });

    if (authError) {
      return new Response(
        JSON.stringify({ message: `Error al crear el usuario: ${authError.message}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash de la contraseña para la tabla `usuarios`
    const hashedPassword = await hashPassword(password);

    // Insertar el nuevo usuario en la tabla `usuarios` con el `auth_user_id` obtenido
    const { error } = await supabase
      .from("usuarios")
      .insert([{ 
        user_id: authData.user?.id, // ID del usuario desde Auth
        correo, 
        password: hashedPassword
      }]);

    if (error) {
      return new Response(
        JSON.stringify({ message: `Error al crear el usuario en la base de datos: ${error.message}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
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
    return new Response(
      JSON.stringify({ message: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
