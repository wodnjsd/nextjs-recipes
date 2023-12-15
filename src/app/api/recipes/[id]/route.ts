import prisma from "@/lib/db/prisma";
import { likeRecipeSchema } from "@/lib/validation/recipe";
import { auth } from "@clerk/nextjs";


//* Liking, unliking recipe 
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseResult = likeRecipeSchema.safeParse(body);

    if (!parseResult.success) {
      // console.log(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    const alreadyLiked = await prisma.recipe.findUnique({
      where: {
        id,
        AND: [{ likes: { some: { userId: userId } } }],
      },
    });

    if (!alreadyLiked) {
      const newLike = await prisma.recipe.update({
        where: { id },
        data: {
          likes: {
            create: { userId },
          },
        },
      });
      return Response.json({ newLike }, { status: 200 });
    } else {
      const unlike = await prisma.recipe.update({
        where: { id },
        data: {
          likes: {
            deleteMany: { userId },
          },
        },
      });
      return Response.json({ unlike }, { status: 200 });
    }

  } catch (err) {
    // console.log(err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
