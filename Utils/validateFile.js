import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { buscarParcelasVencidas } from "../Cruds/Parcelas.js";
import { validarCadastroCliente } from "./Validador.js";
import {
  buscarClientesCpf,
  buscarUuidClientes,
  cadastrarCliente,
} from "../Cruds/Clientes.js";
import { criptografarDadosAES } from "./Criptografar.js";
import { cadastrarIndicacoes } from "../Cruds/Indicacoes.js";

var __filename = new URL("", import.meta.url).pathname;

export function limparCamposDocumento(campos, arquivos) {
  const enderecoResidencial = {
    rua: campos["enderecoResidencial.rua"][0],
    numero: campos["enderecoResidencial.numero"][0],
    bairro: campos["enderecoResidencial.bairro"][0],
    complemento: campos["enderecoResidencial.complemento"]?.[0] || null,
    tipoImovel: campos["enderecoResidencial.tipoImovel"][0],
  };

  const enderecoComercial = {
    rua: campos["enderecoComercial.rua"][0],
    numero: campos["enderecoComercial.numero"][0],
    bairro: campos["enderecoComercial.bairro"][0],
    funcaoCargo: campos["enderecoComercial.funcaoCargo"][0],
    nomeEmpresa: campos["enderecoComercial.nomeEmpresa"][0],
  };

  const enderecoPais = {
    rua: campos["enderecoPais.rua"][0],
    numero: campos["enderecoPais.numero"][0],
    bairro: campos["enderecoPais.bairro"][0],
    complemento: campos["enderecoPais.complemento"]?.[0] || null,
  };

  // Mapear referências
  const referencias = [];
  for (let i = 1; i <= 3; i++) {
    if (campos[`referencias[${i}].nome`]) {
      referencias.push({
        nome: campos[`referencias[${i}].nome`][0],
        telefone: campos[`referencias[${i}].telefone`][0],
        grauParentesco: campos[`referencias[${i}].grauParentesco`][0],
      });
    }
  }

  // Mapear parentes
  const parentes = [];
  for (let i = 1; i <= 2; i++) {
    if (campos[`parente${i}.nome`]) {
      parentes.push({
        nome: campos[`parente${i}.nome`][0],
        grauParentesco: campos[`parente${i}.grauParentesco`][0],
        endereco: {
          rua: campos[`parente${i}.endereco.rua`][0],
          numero: campos[`parente${i}.endereco.numero`][0],
          bairro: campos[`parente${i}.endereco.bairro`][0],
        },
      });
    }
  }

  // Extrair apenas os newFilename dos arquivos
  const documentos = {
    documento_file: Array.isArray(arquivos.documento_file)
      ? arquivos.documento_file[0].newFilename
      : arquivos.documento_file.newFilename,
    tipo_documento: campos.tipo_documento[0],
    residencia_file: Array.isArray(arquivos.residencia_file)
      ? arquivos.residencia_file[0].newFilename
      : arquivos.residencia_file.newFilename,
    carteira_file: Array.isArray(arquivos.carteira_file)
      ? arquivos.carteira_file[0].newFilename
      : arquivos.carteira_file.newFilename,
  };

  return {
    indicacao: campos.indicacao[0],
    nome_Clientes: campos.nome[0],
    cpf: campos.cpf[0],
    telefone: campos.telefone[0],
    endereco_residencial: enderecoResidencial,
    endereco_comercial: enderecoComercial,
    pai: { nome: campos.nomePai[0], endereco: enderecoPais },
    mae: { nome: campos.nomeMae[0], endereco: enderecoPais },
    documento_file: documentos.documento_file,
    tipo_documento: documentos.tipo_documento,
    residencia_file: documentos.residencia_file,
    carteira_file: documentos.carteira_file,
    comprovacao_tipo: campos.comprovacaoTipo[0],
    referencias: referencias,
    parentes: parentes,
    chavePix: campos.chavePix?.[0] || null,
    tipo_chave_pix: campos.tipoChavePix[0],
    status: campos.status[0],
    indicacaoBox: campos.indicacaoBox[0],
    indicacaoGrau: campos.indicacaoGrau[0],
    score:campos.score ? parseInt(campos.score[0]) : null,
  };
}

export async function uploadDocumento(
  campos,
  arquivos,
  uuidDono,
  caminhoArquivo
) {
  try {
    const validaDocumento = await validarDocumentoArquivo(campos);

    if (validaDocumento.erro || !validaDocumento.indicacao
    ) {
      console.log("Validação de documento falhou:", validaDocumento);
      return validaDocumento; // CORRIGIDO: era resolve(), mas não estava dentro de Promise
    }
    var objetoCliente = limparCamposDocumento(campos, arquivos);
    const { iv, dadosCriptografados, tag } = criptografarDadosAES(
      objetoCliente.cpf
    );
    objetoCliente.cpf = dadosCriptografados;
    objetoCliente.iv = iv;
    objetoCliente.tag = tag;
    const indicacaoCliente = validaDocumento.indicacao

    const resultadoCadastro = await cadastrarCliente(objetoCliente);

    cadastrarIndicacoes(
      indicacaoCliente.Clientes_id,
      resultadoCadastro.Clientes_id,
      indicacaoCliente.nome,
      indicacaoCliente.cpf,
      indicacaoCliente.telefone,
      objetoCliente.indicacaoGrau,
      objetoCliente.indicacaoBox === true ? "aprovado" : "pendente"
    );

    // Verificar se o cadastro retornou o UUID do cliente
    if (!resultadoCadastro || !resultadoCadastro.Clientes_id) {
      console.error("Erro: UUID do cliente não foi retornado");
      return { erro: true, mensagem: "Erro ao obter UUID do cliente"  }; 
    }

    // Definir caminho definitivo dos documentos
    const caminhoDefinitivo = definirCaminhoUpload(
      "documento",
      uuidDono,
      resultadoCadastro.Clientes_id
    );

    // Mover os arquivos da pasta temporária para a pasta definitiva
    // CORRIGIDO: usar .newFilename ao invés do objeto completo
    const arquivosParaMover = [
      {
        origem: path.join(
          caminhoArquivo,
          arquivos.documento_file[0].newFilename
        ),
        destino: path.join(
          caminhoDefinitivo,
          arquivos.documento_file[0].newFilename
        ),
      },
      {
        origem: path.join(
          caminhoArquivo,
          arquivos.residencia_file[0].newFilename
        ),
        destino: path.join(
          caminhoDefinitivo,
          arquivos.residencia_file[0].newFilename
        ),
      },
      {
        origem: path.join(
          caminhoArquivo,
          arquivos.carteira_file[0].newFilename
        ),
        destino: path.join(
          caminhoDefinitivo,
          arquivos.carteira_file[0].newFilename
        ),
      },
    ];

    // Mover cada arquivo
    for (const arquivo of arquivosParaMover) {
      const movido = moverArquivo(arquivo.origem, arquivo.destino);
      if (!movido) {
        console.error(`Falha ao mover arquivo: ${arquivo.origem}`);
      }
    }

    // CORRIGIDO: retornar resultado de sucesso

    return { sucesso: true, clienteId: resultadoCadastro.Clientes_id };
  } catch (error) {
    console.log(error);
    return { erro: true, mensagem: "Um erro ocorreu durante o upload" };
  }
}
export const ConfigBasica = {
  uploadBase: path.resolve(__filename, "..", "..", "..", "usuarios"),
  tiposDocumentos: [
    "pdf",
    "doc",
    "docx",
    "txt",
    "rtf",
    "odt",
    "csv",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
  ],
  tiposImagens: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
};
export function moverArquivo(origem, destino) {
  try {
    // Garantir que o diretório de destino existe
    const dirDestino = path.dirname(destino);
    if (!fs.existsSync(dirDestino)) {
      fs.mkdirSync(dirDestino, { recursive: true });
    }

    // Mover o arquivo
    fs.renameSync(origem, destino);
    console.log(`Arquivo movido de ${origem} para ${destino}`);
    return true;
  } catch (error) {
    console.error(`Erro ao mover arquivo: ${error.message}`);
    return false;
  }
}

export function definirCaminhoUpload(tipo, uuidDono, uuidCliente) {
  switch (tipo) {
    case "temporario":
      return `${ConfigBasica.uploadBase}/temporarios`;
    case "documento":
      return `${ConfigBasica.uploadBase}/${uuidDono}/clientes/${uuidCliente}/documentos`;
    case "imagem":
      return `${ConfigBasica.uploadBase}/${uuidDono}/clientes/${uuidCliente}/imagens`;
    default:
      throw new Error("Tipo de upload desconhecido");
  }
}

export function filtroExtensao(extensao, tiposPermitidos, variavelErro) {
  if (!tiposPermitidos.includes(extensao.toLowerCase())) {
    variavelErro.mensagem = "Tipo de arquivo não permitido";
    return false;
  }
  return true;
}

export function validarDocumento(name) {
  if (
    name !== "documento_file" &&
    name !== "residencia_file" &&
    name !== "carteira_file"
  ) {
    erro.mensagem = "Nome do campo de arquivo inválido";
    return false;
  }
  return true;
}

export async function validarDocumentoArquivo(campos) {
  var erro = {};
  if(!campos.indicacao || !campos.cpf){
    erro.mensagem = "Campos obrigatórios ausentes";
    return { erro: true, mensagem: "Campos obrigatórios ausentes" };
  }
  console.log("Validando cadastro para campos:", campos.indicacao[0], campos.cpf[0]);
  const [validacao, parcelasVencidas, indicacao, clienteCpf] = await Promise.all([
      validarCadastroCliente(campos),
      buscarParcelasVencidas(campos.indicacao[0]),
      buscarUuidClientes(campos.indicacao[0]),
      buscarClientesCpf(campos.cpf[0]),
    ]);
  console.log("Cliente CPF:", clienteCpf);
  if (clienteCpf) {
    erro.mensagem = "CPF já cadastrado";
    return { erro: true, mensagem: "CPF já cadastrado" };
  }
  console.log("Indicação encontrada:", indicacao);
  if(!indicacao){
    erro.mensagem = "Cliente indicacao não encontrado";
    return { erro: true, mensagem: "Cliente indicacao nao encontrado" };
  }

  if (
    indicacao.status === "pendente" ||
    indicacao.status === "rejeitado" ||
    indicacao.status === "cancelado" ||
    indicacao.status === "inadimplente"
  ) {
    erro.mensagem = "Cliente indicacao não encontrado";
    return { erro: true, mensagem: "Cliente inadimplente ou com desativado" };
  }
  if (parcelasVencidas && parcelasVencidas.length > 0) {
    erro.mensagem =
      "O cliente indicado possui parcelas vencidas. Não é possível prosseguir com o cadastro.";
    return {
      erro: true,
      mensagem:
        "O cliente indicado possui parcelas vencidas. Não é possível prosseguir com o cadastro.",
    };
  }
  if (!validacao.valido) {
    erro.mensagem = validacao.mensagem;
    return { erro: true, mensagem: validacao.mensagem };
  }
  return { erro: false,indicacao: indicacao  };
}
