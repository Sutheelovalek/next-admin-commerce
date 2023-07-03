/* eslint-disable @next/next/no-img-element */
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="flex justify-between items-center bg-blue-500 text-white px-4 py-2">
        <h1 className="text-lg font-bold">
          Hello, <span className="font-normal">{session?.user?.name}</span>
        </h1>
        <div className="flex items-center gap-2">
          <img
            src={session?.user?.image}
            alt="my-image"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
