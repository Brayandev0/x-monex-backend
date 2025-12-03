import { Clientes } from "./Clientes.js";
import Emprestimos from "./Emprestimos.js";
import { Indicacoes } from "./Indicacoes.js";
import Parcelas from "./Parcelas.js";


Clientes.hasOne(Indicacoes, {
  foreignKey: "uuid_Cliente_Indicacoes",
  as: "IndicacaoRecebida"
});

Indicacoes.belongsTo(Clientes, {
  foreignKey: "uuid_Clientes", // quem indicou
  as: "Indicador"
});


Clientes.hasMany(Emprestimos, {
  foreignKey: "uuid_Clientes",
  as: "EmprestimosCliente"
});

Emprestimos.belongsTo(Clientes, {
  foreignKey: "uuid_Clientes",
  as: "clientesEmprestimos"
});



Emprestimos.hasMany(Parcelas, {
  foreignKey: "uuid_Emprestimos",
  as: "DatasParcelas"
})

Parcelas.belongsTo(Emprestimos, {
  foreignKey: "uuid_Emprestimos",
  as: "DatasParcelas"
})