import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="fixed top-0 z-30 flex w-full h-full flex-col items-center justify-center gap-5 bg-slate-400 ">
      {/* <span>Logo</span> */}
      <span className="tracking-light font-playfair text-4xl font-extrabold">
        Spicify
      </span>
      <p className="max-w-prose text-center">
        Your ultimate recipe app with AI integration, built with OpenAI,
        Pinecone, Next.js, Shadcn UI, Clerk, and more.
      </p>
      <Button size="lg" asChild>
        <Link href="/recipes">Open</Link>
      </Button>
    </main>
  );
}
