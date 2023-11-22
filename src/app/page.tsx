import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-24">
      <div className="flex items-center gap-4">
        {/* <span>Logo</span> */}
        <span className="tracking-light text-4xl font-extrabold font-playfair">Spicify</span>
      </div>
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
