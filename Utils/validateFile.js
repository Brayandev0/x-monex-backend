import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { buscarParcelasVencidas } from "../Cruds/Parcelas.js";
import { validarCadastroCliente } from "./Validador.js";
import {
  buscarClientesCpfTelefone,
  buscarUuidClientes,
  cadastrarCliente,
} from "../Cruds/Clientes.js";
import { criptografarDadosAES } from "./Criptografar.js";
import { cadastrarIndicacoes } from "../Cruds/Indicacoes.js";
import { geraruuid } from "./gerador.js";

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
  console.log("Arquivos recebidos:", arquivos);
  console.log("Campos recebidos:", campos);
  const documentos = {
    documento_file: arquivos.documento_file.newFilename,
    tipo_documento: campos.tipo_documento[0],
    residencia_file: arquivos.residencia_file.newFilename,
    carteira_file: arquivos.carteira_file
      ? arquivos.carteira_file.newFilename
      : null,
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
    carteira_file: documentos.carteira_file ? documentos.carteira_file : null,
    comprovacao_tipo: campos.comprovacaoTipo[0],
    referencias: referencias,
    parentes: parentes,
    chavePix: campos.chavePix?.[0] || null,
    tipo_chave_pix: campos.tipoChavePix[0],
    status: campos.status[0],
    indicacaoBox: campos.indicacaoBox[0],
    indicacaoGrau: campos.indicacaoGrau[0],
    score: campos.score ? parseInt(campos.score[0]) : 0,
  };
}

export async function uploadDocumento(campos, arquivos, uuidDono) {
  try {
    const validaDocumento = await validarDocumentoArquivo(campos,uuidDono);

    if (validaDocumento.erro ) {
      console.log("Validação de documento falhou:", validaDocumento);
      return validaDocumento; // CORRIGIDO: era resolve(), mas não estava dentro de Promise
    }
    console.log("Arquivos : ", arquivos);
    const uuidCliente = await geraruuid();
    if (!arquivos.documento_file || !arquivos.residencia_file) {
      return {
        erro: true,
        mensagem: "Todos os arquivos obrigatórios devem ser enviados",
      };
    }
    const caminhoFinal = definirCaminhoUpload(
      "documento",
      uuidDono,
      uuidCliente
    );
    moverArquivo(
      arquivos.documento_file[0].filepath,
      path.join(caminhoFinal, arquivos.documento_file[0].newFilename)
    );
    moverArquivo(
      arquivos.residencia_file[0].filepath,
      path.join(caminhoFinal, arquivos.residencia_file[0].newFilename)
    );
    if (arquivos.carteira_file) {
      moverArquivo(
        arquivos.carteira_file[0].filepath,
        path.join(caminhoFinal, arquivos.carteira_file[0].newFilename)
      );
    }
    if (arquivos.contrato_file) {
      moverArquivo(
        arquivos.contrato_file[0].filepath,
        path.join(caminhoFinal, arquivos.contrato_file[0].newFilename)
      );
    }

    var objetoCliente = limparCamposDocumento(campos, arquivos);
    const { iv, dadosCriptografados, tag } = criptografarDadosAES(
      objetoCliente.cpf
    );
    objetoCliente.cpf = dadosCriptografados;
    objetoCliente.iv = iv;
    objetoCliente.tag = tag;
    objetoCliente.tipo_documento = campos.tipo_documento[0];
    objetoCliente.documento_file = arquivos.documento_file[0].newFilename;
    objetoCliente.residencia_file = arquivos.residencia_file[0].newFilename;
    objetoCliente.carteira_file = arquivos.carteira_file
      ? arquivos.carteira_file[0].newFilename
      : null;
    objetoCliente.contrato_aluguel = arquivos.contrato_file
      ? arquivos.contrato_file[0].newFilename
      : null;

    objetoCliente.Dono_id = uuidDono;      

    console.log("Objeto Cliente : ", objetoCliente);

    // const indicacaoCliente = validaDocumento.indicacao;
    
    const resultadoCadastro = await cadastrarCliente(objetoCliente);

    // await cadastrarIndicacoes(
    //   indicacaoCliente.Clientes_id,
    //   resultadoCadastro.Clientes_id,
    //   indicacaoCliente.nome,
    //   indicacaoCliente.cpf,
    //   indicacaoCliente.telefone,
    //   objetoCliente.indicacaoGrau,
    //   objetoCliente.indicacaoBox === true ? "aprovado" : "pendente"
    // );

    // Verificar se o cadastro retornou o UUID do cliente
    if (!resultadoCadastro || !resultadoCadastro.Clientes_id) {
      console.error("Erro: UUID do cliente não foi retornado");
      return { erro: true, mensagem: "Erro ao obter UUID do cliente" };
    }

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
    "png",
    "jpg",
    "jpeg",
    "docx",
    "docx",

  ],
  tiposImagens: ["jpg", "jpeg", "png"],
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

function verificarExtensaoPermitida(extensao, tiposPermitidos, variavelErro) {
  if (!tiposPermitidos.includes(extensao.toLowerCase())) {
    variavelErro.mensagem = `Extensão de arquivo .${extensao} não é permitida.`;
    return false;
  }
  return true;
}

export function filtroExtensao(extensao, variavelErro, tipo) {
  switch (tipo) {
    case "documento":
      return verificarExtensaoPermitida(
        extensao,
        ConfigBasica.tiposDocumentos,
        variavelErro
      );
    case "imagem":
      return verificarExtensaoPermitida(
        extensao,
        ConfigBasica.tiposImagens,
        variavelErro
      );
    default:
      variavelErro.mensagem = "Tipo de arquivo desconhecido para filtro";
      return false;
  }
}

export function validarDocumento(name, erro) {
  console.log("Name : " + name);
  if (
    name !== "documento_file" &&
    name !== "residencia_file" &&
    name !== "carteira_file" &&
    name !== "fachada_file" &&
    name !== "contrato_file"
  ) {
    erro.mensagem = "Nome do campo de arquivo inválido";
    return false;
  }
  return true;
}

export async function validarDocumentoArquivo(campos,donouuid) {
  var erro = {};
  if (!campos.cpf) {
    erro.mensagem = "Campos obrigatórios ausentes";
    return { erro: true, mensagem: "Campos obrigatórios ausentes" };
  }
  const [validacao, parcelasVencidas, clienteCpf] =
    await Promise.all([
      validarCadastroCliente(campos),
      buscarParcelasVencidas(campos.indicacao[0]),
      // buscarUuidClientes(campos.indicacao[0],donouuid),
      buscarClientesCpfTelefone(campos.cpf[0], campos.telefone[0],donouuid),
    ]);
    console.log("CLIENTE CPF: ", clienteCpf);
  if (clienteCpf) {
    erro.mensagem = "CPF já cadastrado ou telefone já cadastrado";
    return {
      erro: true,
      mensagem: "CPF já cadastrado ou telefone já cadastrado",
    };
  }
  // if (!indicacao) {
  //   erro.mensagem = "Cliente indicacao não encontrado";
  //   return { erro: true, mensagem: "Cliente indicacao nao encontrado" };
  // }

  // if (
  //   indicacao.status === "pendente" ||
  //   indicacao.status === "rejeitado" ||
  //   indicacao.status === "cancelado" ||
  //   indicacao.status === "inadimplente"
  // ) {
  //   erro.mensagem = "Cliente indicacao não encontrado";
  //   return { erro: true, mensagem: "Cliente inadimplente ou com desativado" };
  // }
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
  // return { erro: false, indicacao: indicacao };
  return { erro: false };

}
