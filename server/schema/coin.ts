import { JSONSchemaType } from "ajv";
import ajvInstance from "../middleware/ajv-instance";

interface MyData {
  amount: string;
  symbol: string;
  convert: string;
}

const coinSchema: JSONSchemaType<MyData> = {
  type: "object",
  properties: {
    amount: { type: "string" },
    symbol: {
      type: "string",
      maxLength: 7,
    },
    convert: { type: "string" },
  },
  required: ["amount", "symbol", "convert"],
  additionalProperties: false,
};

const coin = ajvInstance.compile(coinSchema);
export default coin;
