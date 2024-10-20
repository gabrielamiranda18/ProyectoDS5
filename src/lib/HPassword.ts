import bcrypt from "bcrypt";
                                                                                                                                                                                                        
// Función para hashear (encriptar) una contraseña
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;  // Coste de bcrypt
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Función para verificar una contraseña con su hash
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};
