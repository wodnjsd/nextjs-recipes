import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import UserActivity from "@/components/UserActivity";

const ActivityPage = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const user = await prisma.user.findUniqueOrThrow({
    where: { externalId: userId },
    include: {
      recipes: { orderBy: { createdAt: "desc" } },
      comments: { orderBy: { createdAt: "desc" } },
      likes: { orderBy: { createdAt: "desc" } },
    },
  });

  const allActivities = [
    ...user.recipes.map((recipe) => ({ ...recipe, type: "recipe" })),
    ...user.comments.map((comment) => ({ ...comment, type: "comment" })),
    ...user.likes.map((like) => ({ ...like, type: "like" })),
  ];
  allActivities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <>
      <UserActivity user={user} activities={allActivities} />
    </>
  );
};

export default ActivityPage;
