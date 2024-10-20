// createAdmin.mjs

import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // Carga las variables de entorno desde tu .env

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const createUser = {
  nombre: "Daniel",
  apellido: "Nie",
  direccion: "Calle 123",
  celular: "1234567890",
  correo: "daniel@gmail.com",
  password: "contrasena 123",
  tipo_usuario: "Cliente"
};

async function createAdmin() {
  try {
  
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(createUser.password, 10);

    // Inserta el usuario en la tabla "usuarios"
    const { data: insertData, error: insertError } = await supabase
      .from("usuarios")
      .insert([{
        nombre: createUser.nombre,
        apellido: createUser.apellido,
        direccion: createUser.direccion,
        celular: createUser.celular,
        correo: createUser.correo,
        password: hashedPassword,
        tipo_usuario: createUser.tipo_usuario
      }]);

    if (insertError) {
      console.error("Error al insertar el usuario:", insertError.message);
      return;
    }

    console.log("Admin creado correctamente:", insertData);

    // Realizar una consulta para obtener todos los usuarios
    const { data: users, error: fetchErrorAll } = await supabase
      .from("usuarios")
      .select("*");

    if (fetchErrorAll) {
      console.error("Error al obtener los usuarios:", fetchErrorAll.message);
      return;
    }

    console.log("Usuarios en la tabla:", users);
  } catch (error) {
    console.error("Error en el script:", error);
  }
}

createAdmin();
