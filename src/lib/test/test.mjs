import { hashPassword, verifyPassword } from "./hash.mjs"; // Importamos desde hash.mjs
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Ruta al archivo JSON que simula la "base de datos" (en la misma carpeta que el script)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "db.json");

// Función para leer la base de datos simulada
async function leerDB() {
  const data = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(data);
}

// Función para guardar los cambios en la base de datos simulada
async function guardarDB(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

// Función para registrar un nuevo usuario
async function registrarUsuario(nombre, correo, password) {
  try {
    const db = await leerDB();
    const hashedPassword = await hashPassword(password);

    // Crear un nuevo usuario y añadirlo a la base de datos
    const nuevoUsuario = {
      id: db.usuarios.length + 1,
      nombre,
      correo,
      password: hashedPassword
    };

    db.usuarios.push(nuevoUsuario);
    await guardarDB(db);
    console.log("Usuario registrado correctamente:", nuevoUsuario);
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
  }
}

// Función para iniciar sesión
async function iniciarSesion(correo, password) {
  try {
    const db = await leerDB();
    const usuario = db.usuarios.find(u => u.correo === correo);

    if (!usuario) {
      console.log("Usuario no encontrado.");
      return;
    }

    // Verificar la contraseña hasheada
    const passwordCoincide = await verifyPassword(password, usuario.password);

    if (passwordCoincide) {
      console.log("Inicio de sesión exitoso.");
    } else {
      console.log("Contraseña incorrecta.");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
}

// Función para probar el sistema de registro e inicio de sesión
async function probarLogin() {
  // Registrar un usuario (esto simula la inserción en Supabase)
  await registrarUsuario("John Doe", "johndoe@example.com", "contraseña123");

  // Intentar iniciar sesión con el usuario registrado
  await iniciarSesion("johndoe@example.com", "contraseña123 "); 
  await iniciarSesion("johndoe@example.com", "contraseña123"); 
}

// Ejecutar la función de prueba
probarLogin();
