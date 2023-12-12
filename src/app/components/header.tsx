"use client";

import Link from "next/link";

export default function Header() {
  return (
    <div className="bg-white p-5 text-black shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-3xl font-bold md:text-4xl">
              <span className="text-orange-500">COOK</span>
              <span className="text-black">SHOW</span>
            </h1>
          </Link>
          <div className="hidden md:flex">
            <Link
              className="mx-14 text-center text-xl hover:text-orange-600"
              href="/sign-up"
            >
              CADASTRE-SE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
