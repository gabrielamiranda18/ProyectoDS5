import bcrypt from "bcrypt";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Ruta al archivo JSON que simula la "base de datos" (en la misma carpeta que el script)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "db2.json");

// Función para leer la base de datos simulada
async function leerDB() {
  const data = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(data);
}

// Función para verificar los últimos 4 dígitos
async function verificarUltimos4(token, ultimos4) {
  const db = await leerDB();
  const tarjeta = db.tarjetas.find(t => t.token === token);

  if (!tarjeta) {
    console.log("Tarjeta no encontrada.");
    return false;
  }

  // Verificar los últimos 4 dígitos
  const coincide = await bcrypt.compare(ultimos4, tarjeta.hashedLast4);
  return coincide;
}

// Función para simular una nueva compra
async function realizarCompra(token, ultimos4) {
  try {
    // Verificamos si los últimos 4 dígitos coinciden con la tarjeta registrada
    const esValida = await verificarUltimos4(token, ultimos4);

    if (!esValida) {
      console.log("Los últimos 4 dígitos no coinciden. Compra no autorizada.");
      return;
    }

    // Lógica para procesar el pago usando el token
    console.log(`Compra autorizada utilizando la tarjeta con token: ${token}`);

    // En un entorno real, aquí enviarías el token al proveedor de pagos
  } catch (error) {
    console.error("Error al realizar la compra:", error);
  }
}

// Función para simular una compra reutilizando la tarjeta
async function simularCompra() {
  const token = "tok_82ec7d819a65c94b011433753f7abf1d"; // Reemplaza con un token real almacenado
  const ultimos4 = "1111"; // Los últimos 4 dígitos de la tarjeta

  await realizarCompra(token, ultimos4);
}

simularCompra();
