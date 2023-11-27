// import { revalidatePath } from "next/cache";
// import prisma from "@/lib/db/prisma";

// interface Props {
//   userId: string;
//   username: string;
//   name: string;
// }

// export async function createUser({ userId, name, username }: Props) {
//   try {
//     const upsertUser = await prisma.user.upsert({
//       where: { id: userId },
//       update: {
//         username: username,
//         name: name,
//       },
//       create: {
//         username: username,
//         name: name,
//       },
//     });
//     return Response.json({upsertUser}, {status:201})
//   } catch (err) {
//     console.log(err);
//     return Response.json({error: "Server error"}, {status: 500})
//   }
// }
