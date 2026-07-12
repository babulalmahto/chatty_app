import { customAlphabet } from "nanoid";
import User from "../models/User.js";

const generateUniqueConnectCode = async () => {
  let code, exists;

  do {
    code = generateCode();
    exists = await User.exists({ connectCode: code });
  } while (exists);

  return code;
};

export default generateUniqueConnectCode;
