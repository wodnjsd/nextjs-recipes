import {
  CreateRecipeSchema,
  createRecipeSchema,
} from "@/lib/validation/recipe";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { Recipe } from "@prisma/client";
import { useToast } from "./ui/use-toast";
import LoadingButton from "./LoadingButton";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  recipeToEdit?: Recipe;
}

const AddEditDialog = ({ open, setOpen, recipeToEdit }: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CreateRecipeSchema>({
    resolver: zodResolver(createRecipeSchema),
    // adding default values so they are not undefined, and correct error messages will appear
    defaultValues: {
      title: recipeToEdit?.title || "",
      ingredients: recipeToEdit?.ingredients.join(" ") || "",
      instructions: recipeToEdit?.instructions || "",
      tags: recipeToEdit?.tags.join(" ") || "#yummy",
    },
  });

  //*CREATE and UPDATE
  const onSubmit = async (input: CreateRecipeSchema) => {
    try {
      const ingredientsArray = input.ingredients
        .split("/\r?\n/")
        .filter(Boolean);
      const tagsArray = input.tags.split(/[\s#\r\n]+/).filter(Boolean);

      // Update
      if (recipeToEdit) {
        const response = await fetch("/api/recipes", {
          // next: { tags: ["recipes"] },
          method: "PUT",
          body: JSON.stringify({
            id: recipeToEdit.id,
            ...input,
          }),
        });
        if (!response.ok) throw Error("Status code: " + response.status);
        toast({ description: "Recipe updated" });
      } else {
        // Create
        const response = await fetch("/api/recipes", {
          // next: { tags: ["recipes"] },
          method: "POST",
          body: JSON.stringify(input),
        });
        if (!response.ok) throw Error("Status code: " + response.status);
        //reset input fields if successful
        form.reset();
        toast({ description: "Recipe created!" });
      }
      //refresh server component
      router.refresh();
      //close dialog
      setOpen(false);
    } catch (err) {
      console.log(err);
      //!add toastify later
      alert("something went wrong");
    }
  };

  return (
    //Using Shadcn form components which uses react-hook-form under the hood
    // Make sure to import from the /ui folder which are the shadcn components not radix
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {recipeToEdit ? "Edit Recipe" : "Add Recipe"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Recipe title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe title</FormLabel>
                  <FormControl>
                    <Input placeholder="Recipe title" {...field} />
                  </FormControl>
                  {/* Automatically shows error message of our createRecipeSchema */}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Recipe ingredients */}
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe ingredients</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Recipe ingredients" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Recipe instructions */}
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe instructions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Recipe instructions" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Recipe tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tags" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit button */}
            <DialogFooter className="gap-1">
              {/* <Button type="submit">SUbmit</Button> */}
              <LoadingButton
                type="submit"
                // loading is true until onSubmit async function returns
                loading={form.formState.isSubmitting}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditDialog;
