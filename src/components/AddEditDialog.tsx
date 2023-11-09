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
import LoadingButton from "./LoadingButton";
import { useRouter } from "next/navigation";
import { Recipe } from "@prisma/client";
import { useState } from "react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  recipeToEdit?: Recipe;
}

const AddEditDialog = ({ open, setOpen, recipeToEdit }: Props) => {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter();
  const form = useForm<CreateRecipeSchema>({
    resolver: zodResolver(createRecipeSchema),
    // add default values so they are not undefined, and correct error messages will appear
    defaultValues: {
      title: recipeToEdit?.title || "",
      content: recipeToEdit?.content || "",
    },
  });

  //*CREATE and UPDATE
  const onSubmit = async (input: CreateRecipeSchema) => {
    try {
      if (recipeToEdit) {
        const response = await fetch("/api/recipes", {
          method: "PUT",
          body: JSON.stringify({
            id: recipeToEdit.id,
            ...input,
          }),
        });
        if (!response.ok) throw Error("Status code: " + response.status);
      } else {
        const response = await fetch("/api/recipes", {
          method: "POST",
          body: JSON.stringify(input),
        });
        if (!response.ok) throw Error("Status code: " + response.status);
        //reset input fields if successful
        form.reset();
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

  //*DELETE
  //! add confirmation dialog later
  const deleteRecipe = async() => {
    if (!recipeToEdit) return;
    setDeleting(true)
    try {
      const response = await fetch("/api/recipes", {
        method: "DELETE",
        body: JSON.stringify({
          id: recipeToEdit.id
        })
      })
      if (!response.ok) throw Error("Status code: " + response.status);
      router.refresh();
      setOpen(false);
    } catch (err) {
      console.log(err);
      //!add toastify later
      alert("something went wrong");
    } finally {
      setDeleting(false)
    }
  }
  return (
    //Using Shadcn form components  which uses react-hook-form under the hood
    // Make sure to import from the /ui folder which are the shadcn components
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{recipeToEdit ? "Edit Recipe" : "Add Recipe"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Recipe content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1">
              {recipeToEdit && (
                <LoadingButton
                variant="destructive"
                loading={deleting}
                disabled={form.formState.isSubmitting}
                onClick={deleteRecipe}
                type="button">
                  Delete recipe               
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                // loading is true until onSubmit async function returns
                loading={form.formState.isSubmitting}
                disabled={deleting}
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
