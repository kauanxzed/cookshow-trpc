"use client";

import { Mail } from "lucide-react";
import VerifyEamil from "~/app/components/verifyEmail";

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const Page = ({ searchParams }: PageProps) => {
  const email = searchParams.email;
  const token = searchParams.token;

  return (
    <>
      <div className="container relative flex h-screen flex-col justify-center">
        <div className="mx-auto flex w-full flex-col items-center justify-center">
          {token &&
          typeof token === "string" &&
          email &&
          typeof email === "string" ? (
            <div className="grid gap-2">
              <VerifyEamil email={email} token={token} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Mail size={100} />
              <h2 className="text-xl font-semibold">Verifique o seu Email</h2>
              <p> Um email de verificação foi enviado para {email}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
