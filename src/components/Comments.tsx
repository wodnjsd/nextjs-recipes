import { Comment, User } from "@prisma/client";
import { Delete, ChevronsUpDown, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Textarea } from "./ui/textarea";
import SignInReminder from "./SignInReminder";

interface Props {
  comments: Comment[];
  recipeId: String;
  author: User;
}
const Comments = ({ comments, recipeId, author }: Props) => {
  const [comment, setComment] = useState("");
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { userId } = useAuth();

  //* ADD COMMENT
  const onSubmit = async () => {
    try {
      const response = await fetch(`/api/comments/${recipeId}`, {
        method: "POST",
        body: JSON.stringify({ content: comment }),
      });
      if (!response.ok) throw Error("Status code: " + response.status);
      //!reset textarea
      router.refresh();
      setComment("");
    } catch (err) {
      console.log(err);
      //!add toast later
      alert("something went wrong");
    }
    toast({ description: "Comment added" });
  };

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
      <div className="flex flex-col gap-4">
        <Collapsible>
          <div className="flex justify-between py-3">
            <h3 className="flex gap-2">
              Comments:
              <MessageSquare className="scale-75" strokeWidth={1} />
              <span className="text-xs translate-y-1">{comments.length}</span>
            </h3>

            <CollapsibleTrigger asChild>
              <button className="rounded-lg border p-1">
                <ChevronsUpDown strokeWidth={1} size={16} />
              </button>
            </CollapsibleTrigger>
          </div>
{/* <div className="border-t border-secondary ">{comments[0].content}</div> */}
          <CollapsibleContent>
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex justify-between border-t border-secondary py-3"
              >
                <div className="ml-4">
                  <span className="text-xs">{author.username}</span>
                  <p className="whitespace-pre-wrap text-sm">
                    {comment.content}
                  </p>
                </div>

                {/* add hover transformation */}
                <button
                  type="button"
                  className="mr-4 p-1 hover:scale-105"
                  onClick={() => onDelete(comment.id)}
                >
                  <Delete size={18} strokeWidth={1} />
                </button>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
        <form>
          <Textarea
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={!userId ? () => setShowSignInDialog(true) : onSubmit}
            disabled={!comment}
            className="float-right my-2 rounded-full border bg-secondary/70 px-2 py-1 text-sm  hover:bg-secondary"
          >
            Comment
          </button>
        </form>
      </div>
      <SignInReminder open={showSignInDialog} setOpen={setShowSignInDialog} />
    </>
  );
};

export default Comments;
