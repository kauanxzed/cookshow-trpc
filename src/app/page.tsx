import Link from "next/link";
import { api } from "~/trpc/server";
import { CreateUser } from "./_components/create-user";

export default function Home() {
  return (
    <main className="">
      <CreateUser />
    </main>
  );
}
