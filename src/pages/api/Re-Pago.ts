import type { APIRoute } from "astro";
import { supabase } from "../../lib/database";
import bcrypt from "bcrypt"; // Importar bcrypt para hashear el CVV si es necesario

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener el token JWT de la cabecera de la solicitud
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return new Response(
        JSON.stringify({ message: "No autorizado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener la información del usuario autenticado desde el token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return new Response(
        JSON.stringify({ message: "No autorizado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener los datos del formulario
    const formData = await request.formData();
    const paymentId = formData.get("payment_id")?.toString(); // ID del método de pago guardado
    const cvv = formData.get("cvv")?.toString(); // CVV proporcionado por el usuario

    if (!paymentId || !cvv) {
      return new Response(
        JSON.stringify({ message: "Faltan datos requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Consultar el método de pago guardado del usuario
    const { data: paymentMethod, error: fetchError } = await supabase
      .from("metodos_pagos")
      .select("*")
      .eq("id", paymentId)
      .eq("id_usuario", user.id)
      .single();

    if (fetchError || !paymentMethod) {
      return new Response(
        JSON.stringify({ message: "Método de pago no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hashear el CVV proporcionado por el usuario para compararlo (opcional, dependiendo de la lógica)
    const hashedCvv = await bcrypt.hash(cvv, 10); // Esto sería opcional en función de cómo manejes el CVV

    // Simular el procesamiento del pago utilizando el método de pago guardado
    // Aquí es donde se integraría con una pasarela de pagos externa, como Stripe, PayPal, etc.
    console.log(`Procesando el pago con la tarjeta ID: ${paymentMethod.id} y últimos 4 dígitos: ${paymentMethod.ultimos_digitos}`);
    console.log(`CVV proporcionado (hash): ${hashedCvv}`);

    // Redirigir a una página de confirmación o devolver una respuesta exitosa
    return new Response(
      JSON.stringify({ message: "Pago procesado correctamente con la tarjeta guardada" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Error en la API de reutilización de métodos de pago:", err);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
