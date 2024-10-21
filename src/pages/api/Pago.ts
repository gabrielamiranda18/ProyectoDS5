import type { APIRoute } from "astro";
import { supabase } from "../../lib/database";
import bcrypt from "bcrypt"; // Importar bcrypt para hashear datos sensibles

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
    const tipo_metodo = parseInt(formData.get("tipo_metodo")?.toString() || "0", 10);
    const descripcion = formData.get("descripcion")?.toString() || "";
    const numero_tarjeta = formData.get("numero_tarjeta")?.toString() || "";
    const nombre_tit = formData.get("nombre_tit")?.toString() || "";
    const fecha_exp = formData.get("fecha_exp")?.toString() || "";
    const codigo_seg = formData.get("codigo_seg")?.toString() || "";
    const direccion = formData.get("direccion")?.toString() || "";
    const estado_metodo = formData.get("estado_metodo")?.toString() || "activo"; // Asignar valor predeterminado
    const ultimosDigitos = numero_tarjeta.slice(-4);

    // Validar los datos obligatorios
    if (!numero_tarjeta || !nombre_tit || !fecha_exp || !codigo_seg || !direccion) {
      return new Response(
        JSON.stringify({ message: "Faltan datos requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash del número de tarjeta y el código de seguridad
    const hashedNumeroTarjeta = await bcrypt.hash(numero_tarjeta, 10);
    const hashedCodigoSeg = await bcrypt.hash(codigo_seg, 10);

    // Insertar el nuevo método de pago en la tabla `metodos_pagos`
    const { error: insertError } = await supabase
      .from("metodos_pagos") // Cambiado a "metodos_pagos"
      .insert([
        {
            tipo_metodo,
            descripcion,
            numero_tarjeta: hashedNumeroTarjeta, // Guardar el número de tarjeta hasheado
            ultimos_digitos: ultimosDigitos, // Guardar los últimos 4 dígitos
            nombre_tit,
            fecha_exp,
            codigo_seg: hashedCodigoSeg, // Guardar el CVV hasheado
            direccion,
            estado_metodo,
            id_usuario: user.id, // Usar el ID del usuario autenticado
        },
      ]);

    if (insertError) {
      throw new Error("Error al crear el método de pago: " + insertError.message);
    }

    // Responder con éxito
    return new Response(
      JSON.stringify({ message: "Método de pago registrado con éxito" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Error en la API de métodos de pago:", err);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
