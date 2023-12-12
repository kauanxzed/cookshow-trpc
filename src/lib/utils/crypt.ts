import * as bcrypt from "bcrypt";

const encrypt = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const compare = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export { compare, encrypt };
