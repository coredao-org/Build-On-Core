import express from "express";
import {z} from "zod"
import { sendRawTransaction, } from "./wallet";
import cors from "cors"

const app = express();

const port = process.env.PORT || 3001;

app.use(cors())
app.use(express.json());

const TransactionSchema = z.object({
   to: z.string(),
   data: z.string(),
   value: z.number(),
   chainId: z.union([z.literal(1116), z.literal(137)])
})

const ENV = z.object({
  KEY: z.string(),
  COREDAO_RPC:z.string(),
  POLYGON_RPC:z.string(),
  PORT:z.string().optional()
})
console.log("hiiii")
app.get("/", (req, res) => {
  res.send("Hello World!");
})
app.post("/transaction", async (req, res) => {
  const unparasedBody = req.body;
  console.log(unparasedBody)
  const env = ENV.parse(process.env)
  const parsedTransaction = TransactionSchema.parse(unparasedBody)
  if(!["0xb8F55945296407B8f9a7095F0c71b221a257b2F2","0x3c287EBA998789a4a8C88ec0b251bb08978bb980","0xF81ADed2420c373e34F40D33a01189AdDFe2644D","0x58860B7A392A124206AD76EFf160FF448B7cd46c"].includes(parsedTransaction.to)){
    res.status(400).json({error:"Invalid address"})
    return
  }

  const hash = await sendRawTransaction({
    key: env.KEY as `0x${string}`,
    rpc: parsedTransaction.chainId === 1116 ? env.COREDAO_RPC : env.POLYGON_RPC,
    to: parsedTransaction.to as `0x${string}`,
    value: parsedTransaction.value.toString(),
    data: parsedTransaction.data as `0x${string}`,
    chainId: parsedTransaction.chainId
  })
  console.log({hash},"recept")

  res.status(200).json({hash});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
