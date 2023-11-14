import { Comment } from "@prisma/client";
import { Delete } from "lucide-react";

interface Props {
  comments: Comment[];
}
const Comments = ({ comments }: Props) => {

  //* DELETE COMMENT
  // const onDelete = async (id:String) => {
  //   try  {
  //     const response = await fetch(`/api/comments/${recipe.id}`, {
  //       method: "DELETE",
  //       body: JSON.stringify({
  //         id: id
  //       })
  //     })
  //     if(!response.ok) throw Error("Status code: " + response.status)
  //     router.refresh
  //   } catch (err) {
  //     console.log(err)

  //   }
  // }

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          {/* add hover transformation */}
          <button type="button" className="p-1">
            <Delete size={18} strokeWidth={1}/>
          </button>
          <span>{comment.author}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
