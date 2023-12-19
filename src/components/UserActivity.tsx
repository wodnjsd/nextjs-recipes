import { User, Recipe, Comment, Like } from "@prisma/client";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { PenLine, Heart, MessageSquare } from "lucide-react";
type LikeWithRecipe = Like & { Recipe: Recipe };
type CommentWithRecipe = Comment & { Recipe: Recipe };

type Props = {
  user: User;
  activities: (
    | (Recipe & { type: string })
    | (CommentWithRecipe & { type: string })
    | (LikeWithRecipe & { type: string })
  )[];
};

const UserActivity = ({ user, activities }: Props) => {
  return (
    <Card className="my-12 h-full w-full">
      <CardHeader className="py-10">
        <CardTitle className="font-normal">
          Your Activity - {user.username}
        </CardTitle>
      </CardHeader>
      <CardContent className="font-light">
        <Table>
          <TableCaption>Your Activity</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Recipe</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  {(activity.type === "recipe" && (
                    <div className="flex gap-1">
                      <PenLine strokeWidth={1} size={18} />
                      {`You created '${(activity as Recipe).title}'`}
                    </div>
                  )) ||
                    (activity.type === "comment" && (
                      <div className="flex gap-2">
                        <MessageSquare strokeWidth={1} size={18} />
                        {`You commented '${(activity as Comment).content.slice(
                          0,
                          15,
                        )}${
                          (activity as Comment).content.length > 15 ? "..." : ""
                        }'`}
                      </div>
                    )) ||
                    (activity.type === "like" && (
                      <div className="flex gap-2">
                        <Heart strokeWidth={1} size={18} />
                        {`You liked '${
                          (activity as LikeWithRecipe).Recipe.title
                        }'`}
                      </div>
                    ))}
                </TableCell>
                <TableCell>
                  {activity.type === "recipe" ? (
                    <Link href={`/recipes/${activity.id}`}>
                      {(activity as Recipe).title}
                    </Link>
                  ) : (
                    <Link
                      href={`/recipes/${
                        (activity as CommentWithRecipe | LikeWithRecipe).Recipe
                          .id
                      }`}
                    >
                      {
                        (activity as CommentWithRecipe | LikeWithRecipe).Recipe
                          .title
                      }
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserActivity;
