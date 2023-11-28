//*using zod- validation library (already installed when installing shadcnui)
import { z } from "zod";

//*schema used to validate body in post route
export const createRecipeSchema = z.object({
  //*title is string and has at least 1 character, customised error message
  title: z.string().min(1, { message: "Title is required" }),
  // ingredients: z.string().array().min(1, {message: "Need some ingredients!"}),
  ingredients: z.string().min(1, {message: "Need some ingredients!"}),
  instructions: z.string().min(1, { message: "Add some content" }),
  // tags: z.string().array(),
  tags: z.string(),
  image: z.string().optional()

});

//*can use this for type safety on form later
export type CreateRecipeSchema = z.infer<typeof createRecipeSchema>;

//*zod allows to reuse schema and extend it
export const updateRecipeSchema = createRecipeSchema.extend({
  id: z.string().min(1),
});

export const deleteRecipeSchema = z.object({
  id: z.string().min(1),
});

export const likeRecipeSchema = z.object({
  id: z.string().min(1),
});