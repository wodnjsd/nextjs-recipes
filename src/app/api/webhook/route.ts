import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { IncomingHttpHeaders } from "http";
import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

async function handler(request: Request) {
  const payload = await request.json();
  const body = JSON.stringify(payload);
  const header = headers();

  const heads = {
    "svix-id": header.get("svix-id"),
    "svix-timestamp": header.get("svix-timestamp"),
    "svix-signature": header.get("svix-signature"),
  };

  const wh = new Webhook(process.env.WEBHOOK_SECRET || "");

  let evt: WebhookEvent
 

  try {
    evt = wh.verify(
      body,
      heads as IncomingHttpHeaders & WebhookRequiredHeaders,
    ) as WebhookEvent;
  } catch (err) {
    console.log((err as Error).message);
    return NextResponse.json({ message: err }, { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, first_name, username } = evt.data;
    try {
      await prisma.user.upsert({
        where: { externalId: id},
        create: {
          externalId: id,
          username,
          name: first_name
        },
        update: {  username,
            name: first_name },
      });
      return Response.json({ message: "User created" }, { status: 200 });
    } catch (err) {
      console.log(err);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 },
      );
    }
  }
}

// type EventType = "user.created" | "user.updated" | "*";
// type Event = {
//   data: Record<string, string | number>;
//   object: "event";
//   type: EventType;
// };

export const GET = handler;
export const POST = handler;
export const PUT = handler;
