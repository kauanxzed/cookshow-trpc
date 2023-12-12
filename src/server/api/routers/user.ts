import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { createUserDto } from "~/lib/validators/createUserDto";
import { TRPCError } from "@trpc/server";
import { encrypt, compare } from "~/lib/utils/crypt";
import { resend } from "~/lib/utils/resend";
import { signTokenAsync } from "~/lib/utils/jwtAsync";
import verificationEmail from "../../../app/components/verificationEmail";
import { dbUtils } from "~/lib/utils/dbUtils";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(createUserDto)
    .mutation(async ({ ctx, input }) => {
      const foundUser = await ctx.db
        .select({
          email: users.email,
        })
        .from(users)
        .where(eq(users.email, input.email));

      if (foundUser.length > 0)
        throw new TRPCError({
          message: "email já cadastrado",
          code: "CONFLICT",
          cause: "unique email key",
        });

      const hashPass = await encrypt(input.password);

      const user = await ctx.db
        .insert(users)
        .values({
          username: input.username,
          password: hashPass,
          email: input.email,
        })
        .returning({
          email: users.email,
          token: users.verificationToken,
        });

      if (!user?.[0]?.email || !user?.[0]?.token) {
        throw new TRPCError({
          message: "Erro ao cadastrar usuário",
          code: "INTERNAL_SERVER_ERROR",
          cause: "Internal server error",
        });
      }

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: input.email,
        subject: "Confirmation Email",
        react: verificationEmail({
          email: user[0].email,
          token: user[0].token,
        }),
      });

      return {
        data: {
          message: "email cadastrado com sucesso",
          code: 201,
        },
      };
    }),

  verifyEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        token: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundUsers = await ctx.db
        .select({
          id: users.id,
          token: users.verificationToken,
        })
        .from(users)
        .where(eq(users.email, input.email));

      if (!foundUsers[0])
        throw new TRPCError({
          message: "email não encontrado",
          code: "NOT_FOUND",
          cause: "email not found",
        });

      if (foundUsers[0].token !== input.token)
        throw new TRPCError({
          message: "token inválido",
          code: "UNAUTHORIZED",
          cause: "invalid token",
        });

      await ctx.db.update(users).set({
        verified: true,
      });

      return {
        data: {
          message: "email verificado com sucesso",
          code: 200,
        },
      };
    }),

  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const foundUser = await ctx.db
        .select({ id: users.id, password: users.password })
        .from(users)
        .where(eq(users.email, input.email));

      if (!dbUtils.recordExists(foundUser)) {
        throw new TRPCError({
          message: "email não encontrado",
          code: "NOT_FOUND",
          cause: "email not found",
        });
      }

      const isPasswordCorrect = await compare(
        input.password,
        foundUser[0]!.password,
      );

      if (!isPasswordCorrect) {
        throw new TRPCError({
          message: "senha incorreta",
          code: "UNAUTHORIZED",
          cause: "invalid password",
        });
      }

      const token = await signTokenAsync({ id: foundUser[0]!.id });

      return {
        data: {
          message: "login realizado com sucesso",
          code: 200,
          token,
        },
      };
    }),
});
