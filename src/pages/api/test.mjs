// testPaymentReutilization.mjs

import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // Cargar las variables de entorno desde tu .env

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Configuración de Supabase usando las variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Credenciales del usuario de prueba
const userCredentials = {
  email: "JuanBroce777@gmail.com",
  password: "Password123!"
};

// Datos del método de pago a crear
const createPayment = {
  tipo_metodo: 1,
  descripcion: "Tarjeta de Crédito",
  numero_tarjeta: "1234567890123456",
  nombre_tit: "Juan Perez",
  fecha_exp: "2025-12-01",
  codigo_seg: "123",
  direccion: "Calle 123, Ciudad",
  estado_metodo: "activo"
};

async function insertAndReusePaymentMethod() {
  try {
    // Iniciar sesión con Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: userCredentials.email,
      password: userCredentials.password,
    });

    if (authError) {
      console.error("Error al iniciar sesión:", authError.message);
      return;
    }

    // Obtener el ID del usuario autenticado
    const user = authData.user;
    if (!user) {
      console.error("No se pudo autenticar al usuario.");
      return;
    }

    console.log("Usuario autenticado:", user);

    // Encriptar los datos sensibles
    const hashedNumeroTarjeta = await bcrypt.hash(createPayment.numero_tarjeta, 10);
    const hashedCodigoSeg = await bcrypt.hash(createPayment.codigo_seg, 10);
    const ultimosDigitos = createPayment.numero_tarjeta.slice(-4);

    // Inserta el método de pago en la tabla "metodos_pagos"
    const { data: insertData, error: insertError } = await supabase
      .from("metodos_pagos")
      .insert([{
        tipo_metodo: createPayment.tipo_metodo,
        descripcion: createPayment.descripcion,
        numero_tarjeta: hashedNumeroTarjeta, // Guardar el número de tarjeta hasheado
        ultimos_digitos: ultimosDigitos, // Guardar los últimos 4 dígitos
        nombre_tit: createPayment.nombre_tit,
        fecha_exp: createPayment.fecha_exp,
        codigo_seg: hashedCodigoSeg, // Guardar el CVV hasheado
        direccion: createPayment.direccion,
        estado_metodo: createPayment.estado_metodo,
        id_usuario: user.id // Usar el ID del usuario autenticado
      }]);

    if (insertError) {
      console.error("Error al insertar el método de pago:", insertError);
      return;
    }

    console.log("Método de pago creado correctamente:", insertData);

    // Listar los métodos de pago guardados del usuario
    const { data: paymentMethods, error: fetchError } = await supabase
      .from("metodos_pagos")
      .select("id, descripcion, ultimos_digitos, nombre_tit, fecha_exp")
      .eq("id_usuario", user.id);

    if (fetchError) {
      console.error("Error al obtener los métodos de pago:", fetchError);
      return;
    }

    console.log("Métodos de pago guardados:", paymentMethods);

    // Simulación de reutilización de una tarjeta guardada (ejemplo usando el ID de la tarjeta)
    if (paymentMethods.length > 0) {
      const selectedPaymentMethod = paymentMethods[0]; // Selecciona la primera tarjeta guardada
      console.log(`Reutilizando la tarjeta con ID: ${selectedPaymentMethod.id} y últimos 4 dígitos: ${selectedPaymentMethod.ultimos_digitos}`);
      // Aquí podrías añadir la lógica de procesamiento de pago usando el `ID` de la tarjeta seleccionada
    } else {
      console.log("No se encontraron tarjetas guardadas.");
    }
  } catch (error) {
    console.error("Error en el script:", error);
  }
}

// Ejecutar la función principal
insertAndReusePaymentMethod();
