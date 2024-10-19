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

// Función para iniciar sesión
async function iniciarSesion(id, password) {
  try {
    const db = await leerDB();
    const usuario = db.usuarios.find(u => u.id === id);

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

// Función para probar el sistema de inicio de sesión
async function probarLogin() {
  // Intentar iniciar sesión con el usuario de ID 1 ya registrado
  await iniciarSesion(1, "contraseña123 "); // Contraseña incorrecta (con espacio adicional)
  await iniciarSesion(1, "contraseña123");  // Contraseña correcta
}

// Ejecutar la función de prueba
probarLogin();
