"use client";

import { ArrowRight, Link } from "lucide-react";
import { useForm } from "react-hook-form";
import { buttonVariants } from "~/app/components/ui/button";
import { Input } from "~/app/components/ui/input";
import { Label } from "~/app/components/ui/label";
import { Button } from "~/app/components/ui/button";
import { type TSignInDto } from "~/lib/validators/signInDto";
import { api } from "~/trpc/react";
import { useAuthStore } from "../stores/authstore";
import { Toaster, toast } from "sonner";

const Page = () => {
  const { email, password, setCredentials } = useAuthStore();

  const { register, handleSubmit } = useForm<TSignInDto>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { refetch, isFetching } = api.user.signIn.useQuery(
    { email, password },
    {
      enabled: !!email && !!password,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess: (data) => {
        toast.success(data.data.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );

  const onSubmit = async ({ email, password }: TSignInDto) => {
    await setCredentials(email, password);
    await refetch();
  };

  return (
    <>
      <div className="container relative flex h-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Sign-in</h1>
            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5 text-muted-foreground",
              })}
              href="/sign-in"
            >
              Already have an account? Sign-in
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="grid w-10/12 gap-6 md:w-2/3 lg:w-1/3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                  <div className="grid gap-1 py-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      {...register("email")}
                      type="text"
                      placeholder="email"
                    />
                  </div>

                  <div className="grid gap-1 py-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      {...register("password")}
                      type="password"
                      placeholder="password"
                    />
                  </div>

                  <Button type="submit" disabled={isFetching}>
                    {isFetching ? "Signing-in ..." : "Sign-in"}
                  </Button>
                </div>
              </form>
              <Toaster position="bottom-center" richColors />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
