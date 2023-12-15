import prisma from "@/lib/db/prisma";
import { auth, currentUser } from "@clerk/nextjs";
import {
  createCommentSchema,
  deleteCommentSchema,
} from "@/lib/validation/comment";
import { NextRequest } from "next/server";
// import { revalidatePath } from "next/cache";


//* CREATE COMMENT
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    // console.log(body);
    const parseResult = createCommentSchema.safeParse(body);
    const recipeId = params.id;

    if (!parseResult.success) {
      // console.log(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { content } = parseResult.data;
    const { userId } = auth();
    const user = await currentUser()
    const author = user && user.username? user.username: user?.firstName

    if (!userId || !author) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        recipeId,
      },
    });

    return Response.json({ comment }, { status: 201 });
  } catch (err) {
    // console.log(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

//* DELETE COMMENT
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseResult = deleteCommentSchema.safeParse(body);

    if (!parseResult.success) {
      // console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return Response.json({ error: "Recipe not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== comment.userId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }
    await prisma.comment.delete({ where: { id } });

    return Response.json({ message: "Comment deleted" }, { status: 200 });

  } catch (err) {
    // console.log(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
