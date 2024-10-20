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

    // Llamamos a la API de hash para encriptar la contraseña
    const hashedPassword = await hashPassword(password);

    // Definir el tipo de usuario según el correo
    if (correo.endsWith("@jselectronics.org")) {
      tipo_usuario = "Empleado";
    } else {
      tipo_usuario = "Cliente";
    }

    // Insertar el nuevo usuario en la base de datos con la contraseña encriptada
    const { error } = await supabase
      .from("usuarios")
      .insert([{ nombre, apellido, correo, password: hashedPassword, direccion, celular, tipo_usuario }]);

    if (error) {
      throw new Error("Error al crear el usuario: " + error.message);
    }

    // Redirigir a la página de inicio de sesión después de crear el usuario
    return redirect("/login");

  } catch (err) {
    console.error("Error en la API de creación de usuario:", err);
    return new Response("/CrearCuenta", { status: 500 });
  }
};
