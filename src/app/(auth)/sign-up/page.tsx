"use client";

import { ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "~/app/components/ui/button";
import { Input } from "~/app/components/ui/input";
import { Label } from "~/app/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import {
  type TCreateUserDto,
  createUserDto,
} from "~/lib/validators/createUserDto";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
    reset,
  } = useForm<TCreateUserDto>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(createUserDto),
  });

  const { mutateAsync, isLoading } = api.user.create.useMutation();

  const onSubmit = async ({
    username,
    email,
    password,
    confirmPassword,
  }: TCreateUserDto) => {
    await mutateAsync(
      {
        username,
        email,
        password,
        confirmPassword,
      },
      {
        onSuccess: (res) => {
          toast.success(res.data.message);
          router.push("verify-email?email=" + email);
          reset();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <>
      <div className="container relative flex h-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
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
                    <Label htmlFor="username">Username</Label>
                    <Input
                      {...register("username")}
                      type="text"
                      placeholder="username"
                    />
                    {errors.username && touchedFields.username && (
                      <div className="flex flex-row rounded bg-red-200 p-2 text-sm text-red-700">
                        <AlertCircle className="mx-2 h-5 w-5" />
                        {errors.username.message}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-1 py-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="you@example.com"
                    />
                    {errors.email && touchedFields.email && (
                      <div className="flex flex-row rounded bg-red-200 p-2 text-sm text-red-700">
                        <AlertCircle className="mx-2 h-5 w-5" />
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-1 py-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      {...register("password")}
                      type="password"
                      placeholder="*********"
                    />
                    {errors.password && touchedFields.password && (
                      <div className="flex flex-row rounded bg-red-200 p-2 text-sm text-red-700">
                        <AlertCircle className="mx-2 h-5 w-5 align-bottom" />
                        {errors.password.message}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-1 py-2">
                    <Label htmlFor="confirmPassword">ConfirmPassword</Label>
                    <Input
                      {...register("confirmPassword")}
                      type="password"
                      placeholder="*********"
                    />
                    {errors.confirmPassword &&
                      touchedFields.confirmPassword && (
                        <div className="flex flex-row rounded bg-red-200 p-2 text-sm text-red-700">
                          <AlertCircle className="mx-2 h-5 w-5" />
                          {errors.confirmPassword.message}
                        </div>
                      )}
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Signing-up ..." : "Sign-up"}
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
