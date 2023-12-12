import jwt from "jsonwebtoken";
import { env } from "~/env.mjs";

export const signTokenAsync = (
  payload: object,
  options?: jwt.SignOptions,
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, env.JWT_SECRET, options ?? {}, (err, token) => {
      if (err ?? !token) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export const verifyTokenAsync = (
  token: string,
): Promise<jwt.JwtPayload | string> => {
  return new Promise<jwt.JwtPayload | string>((resolve, reject) => {
    jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
      if (err ?? !decoded) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
