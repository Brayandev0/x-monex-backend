import { Usuarios } from "../Models/Usuarios.js";

export async function buscarEmail(email) {
  return await Usuarios.findOne({ where: { email_Usuarios: email } });
}
