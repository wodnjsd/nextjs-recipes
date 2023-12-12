import { User, Recipe, Comment, Like } from "@prisma/client";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "./ui/card";

type Props = {
  user: User;
  activities: (
    | (Recipe & { type: string })
    | (Comment & { type: string })
    | (Like & { type: string })
  )[];
};

const UserActivity = ({ user, activities }: Props) => {
  return (
    <Card className="h-full w-full my-12">
      <CardHeader className="py-10">
        <CardTitle>Your Activity - {user.username}</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.map((activity) => {
          if (activity.type === "recipe") {
            return (
              <p key={activity.id}>
                <span>{activity.createdAt.toLocaleDateString()} - </span>You
                created: {(activity as Recipe).title}
              </p>
            );
          } else if (activity.type === "comment") {
            return (
              <p key={activity.id}>
                <span>{activity.createdAt.toLocaleDateString()} - </span>You
                commented:{(activity as Comment).content}
              </p>
            );
          } else if (activity.type === "like") {
            return (
              <p key={activity.id}>
                <span>{activity.createdAt.toLocaleDateString()} - </span>You liked
                as {(activity as Like).recipeId}
              </p>
            );
          }
          return null;
        })}
      </CardContent>
    </Card>
  );
};

export default UserActivity;
