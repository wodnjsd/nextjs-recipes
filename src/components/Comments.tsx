import { Comment } from "@prisma/client";
import { Delete } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";

interface Props {
  comments: Comment[];
  recipeId: String;
}
const Comments = ({ comments, recipeId }: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  //* DELETE COMMENT
  const onDelete = async (id: String) => {
    try {
      const response = await fetch(`/api/comments/${recipeId}`, {
        method: "DELETE",
        body: JSON.stringify({
          id: id,
        }),
      });
      if (!response.ok) throw Error("Status code: " + response.status);
      toast({ variant: "destructive", description: "Comment deleted" });
      router.refresh();
    } catch (err) {
      console.log(err);
      alert("something went wrong");
    }
  };

  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="flex justify-between py-5 border-t border-secondary">
          <div>
            <p className="text-sm">{comment.content}</p>
            <span className="text-xs">{comment.author}</span>
          </div>

          {/* add hover transformation */}
          <button
            type="button"
            className="p-1 hover:scale-105"
            onClick={() => onDelete(comment.id)}
          >
            <Delete size={18} strokeWidth={1} />
          </button>
        </div>
      ))}
    </>
  );
};

export default Comments;
