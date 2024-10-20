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

// Función para guardar los cambios en la base de datos simulada
async function guardarDB(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

// Función para generar un token simulado
function generarToken() {
  return `tok_${crypto.randomBytes(16).toString("hex")}`;
}

// Función para hashear los últimos 4 dígitos de la tarjeta
async function hashLast4(last4) {
  const saltRounds = 10;
  return await bcrypt.hash(last4, saltRounds);
}

// Función para cifrar un dato con AES-256-CTR
function cifrarDato(dato) {
  const algoritmo = 'aes-256-ctr';
  const clave = crypto.randomBytes(32); // Generar una clave segura de 32 bytes (256 bits)
  const iv = crypto.randomBytes(16); // Vector de inicialización de 16 bytes

  const cipher = crypto.createCipheriv(algoritmo, clave, iv);
  let datoCifrado = cipher.update(dato, 'utf8', 'hex');
  datoCifrado += cipher.final('hex');

  // Devolver el dato cifrado junto con el IV y la clave utilizados
  return {
    datoCifrado,
    iv: iv.toString('hex'),
    clave: clave.toString('hex')
  };
}

// Función para registrar una tarjeta de crédito
async function registrarTarjeta(tarjetaNumero, fechaExpiracion, nombre, tipo) {
  try {
    // Obtenemos los últimos 4 dígitos de la tarjeta
    const last4 = tarjetaNumero.slice(-4);

    // Generamos un token para representar la tarjeta
    const token = generarToken();

    // Hasheamos los últimos 4 dígitos
    const hashedLast4 = await hashLast4(last4);

    // Ciframos la fecha de expiración usando AES-256-CTR
    const { datoCifrado: fechaExpiracionCifrada, iv, clave } = cifrarDato(fechaExpiracion);

    // Leer la base de datos actual
    const db = await leerDB();

    // Crear un nuevo registro de tarjeta
    const nuevaTarjeta = {
      id: db.tarjetas.length + 1,
      token,
      hashedLast4,
      fechaExpiracion: fechaExpiracionCifrada,
      iv, // Almacenar IV para descifrar en el futuro
      clave, // Nota: No almacenes la clave de cifrado en la base de datos en un entorno real
      nombre,
      tipo
    };

    // Guardar en la base de datos
    db.tarjetas.push(nuevaTarjeta);
    await guardarDB(db);

    console.log("Tarjeta registrada correctamente:", nuevaTarjeta);
  } catch (error) {
    console.error("Error al registrar la tarjeta:", error);
  }
}

// Función para simular la inserción de una tarjeta de crédito
async function simularRegistro() {
  const tarjetaNumero = "4111111111111111"; // Simulamos un número de tarjeta
  const fechaExpiracion = "12/25";
  const nombre = "Juan Pérez";
  const tipo = "Visa";

  // Registrar la tarjeta
  await registrarTarjeta(tarjetaNumero, fechaExpiracion, nombre, tipo);
}

simularRegistro();
