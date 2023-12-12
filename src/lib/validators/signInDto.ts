import { z } from "zod";

export const signInDto = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type TSignInDto = z.infer<typeof signInDto>;
