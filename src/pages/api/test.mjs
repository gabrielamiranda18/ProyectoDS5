import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // Cargar variables de entorno

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

// Configurar el cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Correo y contraseña para la prueba de inicio de sesión
const correoPrueba = "carlosreina2100@gmail.com";
const contraseñaPrueba = "12345";

// Función para verificar el inicio de sesión
async function verificarLogin() {
  try {
    // Consultar el usuario por correo electrónico
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("correo", correoPrueba)
      .single();

    if (error) {
      console.error("Error al obtener usuario o usuario no encontrado:", error.message);
      return;
    }

    console.log("Resultado de la consulta:", usuario);

    // Verificar la contraseña utilizando bcrypt
    const passwordCoincide = await bcrypt.compare(contraseñaPrueba, usuario.password);
    if (passwordCoincide) {
      console.log("Inicio de sesión exitoso.");
    } else {
      console.log("Contraseña incorrecta.");
    }

  } catch (err) {
    console.error("Error en la verificación de login:", err);
  }
}

// Ejecutar la función de verificación
verificarLogin();
