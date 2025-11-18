import { config } from "dotenv";
import app from "./app.js";
config()
// Start server
app.listen(process.env.PORT, () => {
  console.log(`Rodando na porta ${process.env.PORT}`);
});