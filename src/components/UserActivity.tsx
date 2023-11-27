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
  activities:
    (Recipe & {type:string} | Comment& {type:string}| Like & {type:string}) [] 
 
};

const UserActivity = ({ user, activities }: Props) => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Your Activity - {user.username}</CardTitle>
      </CardHeader>
      <CardContent>
       
        {activities.map((activity) => {
          if (activity.type === "recipe") {
            return <h4 key={activity.id}>You created: {(activity as Recipe).title}</h4>;
          } else if (activity.type === "comment") {
            return <h4 key={activity.id}>You commented:{(activity as Comment).content}</h4>;
          } else if (activity.type === "like") {
            return <h4 key={activity.id}>You liked as {(activity as Like).recipeId}</h4>;
          }
          return null;
        })}
      </CardContent>
    </Card>
  );
};

export default UserActivity;
