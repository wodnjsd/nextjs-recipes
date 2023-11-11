"use client";

import { Recipe } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import AddEditDialog from "./AddEditDialog";

interface Props {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: Props) => {
  const { userId } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const wasUpdated = recipe.updatedAt > recipe.createdAt;
  const createdUpdatedAtTimestamp = (
    wasUpdated ? recipe.updatedAt : recipe.createdAt
  ).toDateString();

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => setShowEditDialog(true)}
      >
        <CardHeader>
          <CardTitle>{recipe.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{recipe.content}</p>
        </CardContent>
      </Card>
      {/* userId === recipe.userId &&  */}
      <AddEditDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        recipeToEdit={recipe}
      />
    </>
  );
};

export default RecipeCard;
