import argon2 from "argon2";
import crypto from "crypto";
import { configDotenv } from "dotenv";
configDotenv();
export async function criptografarDados(data) {
  return await argon2.hash(data, {
    type: argon2.argon2id, // tipo mais recomendado (argon2d, argon2i, argon2id)
    memoryCost: 2 ** 16, // memória em KB
    timeCost: 5, // número de iterações
    parallelism: 1, // número de threads
  });
}

export async function compararDados(hash, senha) {
  return await argon2.verify(hash, senha);
}

export function criptografarDadosAES(dados) {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(process.env.KEY_ENCRYPT, "hex");
  const criptografador = crypto.createCipheriv(
    "aes-256-gcm",
    key,
    iv
  );

  const encrypted = criptografador.update(dados, "utf8", "hex") + criptografador.final("hex");
  const tag = criptografador.getAuthTag();
  return {
    iv: iv.toString("hex"),
    dadosCriptografados: encrypted,
    tag: tag.toString("hex"),
  };
}

export function descriptografarDadosAES(dadosCriptografados,ivHex,tagHex) {
  const iv = Buffer.from(ivHex, "hex");
  const descriptografador = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(process.env.KEY_ENCRYPT, "hex"),
    iv
  );
  descriptografador.setAuthTag(Buffer.from(tagHex, "hex"));
  return (
    descriptografador.update(dadosCriptografados, "hex", "utf8") +
    descriptografador.final("utf8")
  );
}

