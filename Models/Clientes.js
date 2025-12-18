import { DataTypes } from "sequelize";
import { db } from "./database.js";

export const Clientes = db.define(
  "Clientes",
  {
    Clientes_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
      field: "uuid_Clientes",
    },
    Dono_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: "uuid_Usuarios",
    },
    indicacoes: {
      type: DataTypes.STRING(36),
      allowNull: true,
      field: "indicacoes_Clientes",
    },
    nome: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "nome_Clientes",
    },
    cpf: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
      field: "cpf_Clientes",
    },
    telefone: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
      field: "telefone_Clientes",
    },
    endereco_residencial: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "endereco_residencial_Clientes",
    },
    endereco_comercial: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "endereco_comercial_Clientes",
    },
    pai: {
      type: DataTypes.JSON,
      allowNull: false,
      field: "pai_Clientes",
    },
    mae: {
      type: DataTypes.JSON,
      allowNull: false,
      field: "mae_Clientes",
    },
    referencia: {
      type: DataTypes.JSON,
      allowNull: false,
      field: "referencia_Clientes",
    },
    valor_solicitado: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: "valor_solicitado_Clientes",
    },
    criado_em: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "criado_em_Clientes",
    },
    documento_caminho: {
      type: DataTypes.STRING(100),
      allowNull: true, 
      field: "documento_caminho_Clientes",
    },
    tipo_documento: {
      type: DataTypes.STRING(10),
      allowNull: true, 
      field: "tipo_documento_Clientes",
    },
    comprovante_residencia: {
      type: DataTypes.STRING(100),
      allowNull: true, 
      field: "comprovante_residencia_caminho_Clientes",
    },
    carteira_trabalho: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "carteira_trabalho_caminho_Clientes",
    },
    chave_pix: {
      type: DataTypes.STRING(100),
      allowNull: true, 
      field: "chave_pix_recebedora_Clientes",
    },
    tipo_chave_pix: {
      type: DataTypes.STRING(20),
      allowNull: true, 
      field: "tipo_chave_Clientes",
    },
    byte: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: "byte_Clientes",
    },
    tag: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: "tag_Clientes",
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "pendente",
      field: "status_Clientes",
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 20,
      field: "score_Clientes",
    },
    contrato_aluguel: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "contrato_locacao_aluguel_Clientes",
    },
    arquivado:{
      type:DataTypes.BOOLEAN,
      defaultValue:false,
      field:"arquivado_Clientes"
    },
    cidade:{
      type:DataTypes.STRING(80),
      allowNull:false,
      field:"cidade_Clientes"
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);