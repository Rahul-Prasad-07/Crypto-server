import Ajv, { JSONSchemaType } from "ajv"
import addFormats from "ajv-formats";

const ajvInstance = new Ajv({ allErrors: true });
addFormats(ajvInstance);

export default ajvInstance;
