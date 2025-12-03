import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import {
  ConfigBasica,
  definirCaminhoUpload,
  filtroExtensao,
  uploadDocumento,
  validarDocumento,
} from "./validateFile.js";

export async function UploadFiles(req, tipo, uuidDono, uuidCliente) {
  try {
    var caminhoArquivo = definirCaminhoUpload(tipo, uuidDono, uuidCliente);
    var erro = {};

    if (!fs.existsSync(caminhoArquivo)) {
      fs.mkdirSync(caminhoArquivo, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      const form = new IncomingForm({
        uploadDir: caminhoArquivo,
        keepExtensions: true,
        maxFileSize: 100 * 1024 * 1024, // 100MB
        multiples: true,
        filter: (part) =>
          filtroExtensao(
            part.originalFilename.split(".").pop(),
            tipo === "documento"
              ? ConfigBasica.tiposDocumentos
              : ConfigBasica.tiposImagens,
            erro
          ),
      });

      if (erro.mensagem) {
        return resolve(erro);
      }

      form.on("error", (err) => {
        console.error("Erro no upload:", err);
        erro.mensagem = "Erro no upload do arquivo";
        return reject(erro);
      });

      form.on("fileBegin", (name, file) => {
        if (!name || !file) {
          erro.mensagem = "Arquivo ou nome do campo inválido";
          return reject(erro);
        }
        switch (tipo) {
          case "documento":
            console.log(name)
            if (!validarDocumento(name)) {
              return reject({ mensagem: "Arquivos Invalidos" });
            }
            break;
        }
      });

      form.parse(req, async (erros, campos, arquivos) => {
        if (erros) {
          console.error(erros);
          erro.mensagem = erros;
          return reject(erro);
        }

        if (tipo === "documento") {
          const resultadoUpload = await uploadDocumento(
            campos,
            arquivos,
            uuidDono,
            caminhoArquivo
          );
          console.log("Resultado : ",resultadoUpload);
          if(resultadoUpload.erro || resultadoUpload.indicacao){
            return reject({ mensagem: resultadoUpload.mensagem });
          }
          return resolve(resultadoUpload);
        }

        resolve({ caminhoArquivo, erro });
      });
    });
  } catch (error) {
    console.error(error);
    return { erro: { mensagem: "Um erro ocorreu durante o upload" } };
  }
}
