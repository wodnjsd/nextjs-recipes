import Link from "next/link";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SignInReminder = ({ open, setOpen }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Please sign in first!</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-2">
          <Link href="/sign-in" className="w-4/5">
            <Button className="w-full">Sign in </Button>
          </Link>
          <DialogClose asChild>
            <Button className="w-4/5">Cancel</Button>
          </DialogClose>
        </div>

        <DialogFooter className="flex flex-row items-center gap-2 whitespace-pre text-sm">
          No account?
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign up here
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignInReminder;
