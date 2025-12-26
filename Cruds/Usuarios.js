
import { Usuarios } from "../Models/Usuarios.js";

export async function buscarEmail(email) {
  return await Usuarios.findOne({ where: { email: email } });
}

export async function buscarUuid(uuid) {
  return await Usuarios.findOne({ where: { id: uuid } });
}


