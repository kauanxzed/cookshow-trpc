"use client";

import { XCircle, MailCheck } from "lucide-react";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface VerifyEmailProps {
  email: string;
  token: string;
}

const VerifyEamil = ({ email, token }: VerifyEmailProps) => {
  const { mutate, isError, data, isLoading } =
    api.user.verifyEmail.useMutation();

  useEffect(() => {
    mutate({
      email,
      token,
    });
  }, [email, token, mutate]);

  if (isError)
    return (
      <div className="flex flex-col items-center gap-2">
        <XCircle size={100} />
        <h2 className="text-xl font-semibold">Erro ao verificar o email</h2>
        <p> Ocorreu um erro ao verificar o seu email</p>
      </div>
    );

  if (data)
    return (
      <div className="flex flex-col items-center gap-2">
        <MailCheck size={100} />
        <h2 className="text-xl font-semibold">Email verificado com sucesso</h2>
        <p>O seu email foi verificado com sucesso</p>
        <Link
          href="/sign-in"
          className={buttonVariants({
            variant: "link",
          })}
        >
          Sign in
        </Link>
      </div>
    );

  if (isLoading)
    return (
      <div className="flex flex-col items-center gap-2">
        <ClipLoader size={40} />
        <h2 className="text-xl font-semibold">Verificando o seu email</h2>
      </div>
    );
};

export default VerifyEamil;
