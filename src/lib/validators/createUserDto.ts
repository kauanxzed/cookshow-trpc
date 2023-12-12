import { z } from "zod";

export const createUserDto = z
  .object({
    username: z.string().min(1, { message: "Insira um usuario" }),
    email: z.string().email({ message: "Insira um email válido" }),
    password: z
      .string()
      .min(8, { message: "senha precisa ter no mínimo 8 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas precisam ser iguais",
    path: ["confirmPassword"],
  });

export type TCreateUserDto = z.infer<typeof createUserDto>;
