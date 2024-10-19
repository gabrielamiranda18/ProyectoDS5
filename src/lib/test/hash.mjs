import bcrypt from "bcrypt";

// Función para hashear (encriptar) una contraseña
export const hashPassword = async (password) => {
  const saltRounds = 10; // Coste de bcrypt
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Función para verificar una contraseña con su hash
export const verifyPassword = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};
