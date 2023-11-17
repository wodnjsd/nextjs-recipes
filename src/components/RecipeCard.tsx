"use client";

import { Recipe, Like } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart } from "lucide-react";

interface Props {
  recipe: Recipe;
  likes: Like[];
}

const RecipeCard = ({ recipe, likes }: Props) => {
  // const [showEditDialog, setShowEditDialog] = useState(false);
  const wasUpdated = recipe.updatedAt > recipe.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? recipe.updatedAt : recipe.createdAt
  ).toDateString();

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        // onClick={() => setShowEditDialog(true)}
      >
        <CardHeader>
          <CardTitle>{recipe.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        {/* //! Only show some instructions */}
        <CardContent>
          <p className="whitespace-pre-line">{recipe.instructions}</p>
        </CardContent>
        <CardFooter>
          <Heart strokeWidth="1"/>
          {likes.length}
        </CardFooter>
      </Card>
      {/* <AddEditDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        recipeToEdit={recipe}
      /> */}
    </>
  );
};

export default RecipeCard;
