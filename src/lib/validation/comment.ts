//*using zod- validation library (already installed when installing shadcnui)
import {z} from 'zod'

//*schema used to validate body in post route
export const createCommentSchema = z.object({
    //*content is string and has at least 1 character, customised error message
    content: z.string().min(1, {message: "Add some content"}),
})

//*can use this for type safety on form later 
export type CreateCommentSchema = z.infer<typeof createCommentSchema>

//! Consider adding updating comment later?
// export const updateCommentSchema = createCommentSchema.extend({
//     id: z.string().min(1)
// })

export const deleteCommentSchema = z.object({
    id: z.string().min(1)
})