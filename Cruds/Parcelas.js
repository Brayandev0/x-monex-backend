import { Op } from "sequelize";
import Parcelas from "../Models/Parcelas.js";

export async function buscarParcelasVencidas(uuid_Cliente) {
    return await Parcelas.findAll({
        where: {
            Clientes_id: uuid_Cliente,
            vencimento: {
                [Op.lt]: new Date(),
            },
            status: 'pendente',
        },
    });
    
}