import { Request, Response, NextFunction } from "express";
// import coin from "../schema/coin";

function validateDto(ajvValidate: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const valid = ajvValidate(req.query);
    if (valid) {
      next();
    } else {
      res.status(400).json({ error: "Invalid query parameters" });
    }
  };
}

export default validateDto;

// import Ajv, { JSONSchemaType } from "ajv";


// const ajv = new Ajv();

// const schema: JSONSchemaType<{ amount: number; symbol: string; convert: string }> = {
//   type: "object",
//   properties: {
//     amount: { type: "number" },
//     symbol: { type: "string" },
//     convert: { type: "string" },
//   },
//   required: ["amount", "symbol", "convert"],
//   additionalProperties: false,
// };

// const validate = ajv.compile(schema);
// export default validate;

// import Ajv from "ajv";
// import { inspect } from "util";
// import ajvInstance from "./ajv-instance";



// export const validate = (schema: any) => {
//   const validate = ajvInstance.compile(schema);

//   const verify = (data) => {
//     const isValid = validate(data);
//     if (isValid) {
//       return data;
//     }
//     throw new Error(inspect(validate.errors));
//   }
//   return { schema, verify };
// }