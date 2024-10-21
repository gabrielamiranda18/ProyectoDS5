import type { APIRoute } from "astro";
import { supabase } from "../../lib/database";

// Función para validar el formato del correo electrónico
const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// API para manejar el envío del formulario de contacto
export const POST: APIRoute = async ({ request }) => {
    try {
        // Obtener los datos del formulario
        const formData = await request.formData();

        // Extraer los valores del formulario
        const nombre = formData.get("nombre")?.toString().trim() || "";
        const apellido = formData.get("apellido")?.toString().trim() || "";
        const correo = formData.get("email")?.toString().trim() || "";
        const mensaje = formData.get("mensaje")?.toString().trim() || "";

        // Validar los datos del formulario
        if (!nombre || !apellido || !correo || !mensaje) {
            return new Response(JSON.stringify({ error: "Todos los campos son obligatorios" }), { status: 400 });
        }

        if (!isValidEmail(correo)) {
            return new Response(JSON.stringify({ error: "El correo electrónico no es válido" }), { status: 400 });
        }

        // Validar el mensaje
        if (mensaje.length < 10) {
            return new Response(JSON.stringify({ error: "El mensaje debe tener al menos 10 caracteres" }), { status: 400 });
        }

        // Insertar los datos en Supabase
        const { error } = await supabase
            .from("contacto") 
            .insert([{ nombre, apellido, email: correo, mensaje }]);

        if (error) {
            throw new Error("Error al insertar los datos: " + error.message);
        }

        // Devolver una respuesta de éxito
        return new Response(JSON.stringify({ success: "Datos enviados correctamente" }), { status: 200 });

    } catch (err) {
        console.error(err); // Registra el error
        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
        return new Response(JSON.stringify({ error: "Error: " + errorMessage }), { status: 500 });
    }
};