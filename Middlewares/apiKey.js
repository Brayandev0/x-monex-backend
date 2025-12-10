import { config } from "dotenv";

config();

export async function VerificarApiKey(req,res,next){
    try {
        const apiKey = req.headers['x-api-key'];
        const keyEnv = process.env.API_KEY;

        if(!apiKey || apiKey !== keyEnv || apiKey === undefined){
            console.log("Sem api key", keyEnv.length, apiKey.length);
            return res.status(403).json({ msg: "Acesso não autorizado", code: 403 });
        }
        next();
        
    } catch (error) {
        console.error("Erro ao verificar API Key:", error);
        return res.status(500).json({ msg: "Acesso não autorizado", code: 500 });
    }
}