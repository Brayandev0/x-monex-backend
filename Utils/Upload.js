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

export async function UploadFiles(req, tipo, uuidDono) {
  try {
    var caminhoArquivo = definirCaminhoUpload("temporario", uuidDono);
    var erro = { mensagem: null }; // Inicializar com estrutura
    console.log("Caminho arquivo : ", caminhoArquivo);

    if (!fs.existsSync(caminhoArquivo)) {
      fs.mkdirSync(caminhoArquivo, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      var form = new IncomingForm({
        uploadDir: caminhoArquivo,
        keepExtensions: true,
        maxFileSize: 50 * 1024 * 1024, // 50 MB
        multiples: true,
        minFileSize: 1,
        allowEmptyFiles: false,
        maxFiles: 10,
        filter: (part) => {
          // Validar se o arquivo tem nome
          if (!part.originalFilename) {
            erro.mensagem = "Nome do arquivo inválido";
            return false;
          }

          // Extrair extensão
          const extensao = part.originalFilename.split(".").pop();
          
          // Validar extensão
          const resultado = filtroExtensao(extensao, erro, tipo);
          
          if (!resultado) {
            console.log("Extensão rejeitada:", extensao, "Erro:", erro.mensagem);
          }
          
          return resultado;
        }
      });

      form.on("error", (err) => {
        console.error("Erro no upload:", err);
        erro.mensagem = "Erro no upload do arquivo";
        return reject(erro);
      });

      form.on("fileBegin", (name, file) => {
        console.log(
          "Iniciando upload do arquivo:",
          name,
          file.originalFilename
        );
        
        if (!name || !file) {
          erro.mensagem = "Arquivo ou nome do campo inválido";
          return reject(erro);
        }
        
        switch (tipo) {
          case "documento":
            if (!validarDocumento(name,erro)) {
              erro.mensagem = "Arquivos Invalidos";
              return reject(erro);
            }
            break;
        }
      });

      form.parse(req, async (err, fields, files) => {
        const erros = err;
        const campos = fields;
        const arquivos = files;
        
        // Verificar se há erro de extensão capturado pelo filter
        if (erro.mensagem) {
          console.error("Erro de validação:", erro.mensagem);
          return reject(erro);
        }
        
        if (!arquivos || Object.keys(arquivos).length === 0) {
          erro.mensagem = "Nenhum arquivo enviado";
          return reject(erro);
        }

        if (erros) {
          console.error(erros);
          erro.mensagem = erros.message || "Erro no processamento";
          return reject(erro);
        }

        const arquivosArray = Object.values(files).flat();
        console.log("Arquivos : ", arquivosArray);
        
        if (tipo === "documento") {
          const resultadoUpload = await uploadDocumento(
            campos,
            arquivos,
            uuidDono,
          );
          console.log("Resultado : ", resultadoUpload);
          
          if (resultadoUpload.erro) {
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