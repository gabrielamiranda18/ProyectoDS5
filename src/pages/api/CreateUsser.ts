import type { APIRoute } from "astro";
import { supabase } from "../../lib/database";
import { hashPassword } from "../../lib/HPassword";

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

    // Validar los campos obligatorios
    if (!nombre || !apellido || !correo || !celular || !password) {
      return new Response(JSON.stringify({ message: "Faltan datos del formulario" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validar formato del correo
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    if (!correoValido) {
      return new Response(JSON.stringify({ message: "Correo inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validar la fortaleza de la contraseña
    if (!validarContraseña(password)) {
      return new Response(
      JSON.stringify({ message: "La contraseña no cumple con los requisitos mínimos de seguridad." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Llamamos a la API de hash para encriptar la contraseña
    const hashedPassword = await hashPassword(password);

    // Definir el tipo de usuario según el correo
    let tipo_usuario = correo.endsWith("@jselectronics.org") ? "Empleado" : "Cliente";

    // Insertar el nuevo usuario en la base de datos con la contraseña encriptada
    const { error } = await supabase
      .from("usuarios")
      .insert([{ nombre, apellido, correo, password: hashedPassword, direccion, celular, tipo_usuario }]);

    if (error) {
      return new Response(
        JSON.stringify({ message: "Error al crear el usuario: " + error.message }),
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
