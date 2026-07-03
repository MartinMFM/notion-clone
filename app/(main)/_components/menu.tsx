"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuProps {
  documentId: Id<"documents">;
  isArchived: boolean;
}

const Menu = ({ documentId, isArchived }: MenuProps) => {
  const router = useRouter();
  const { user } = useUser();

  const archive = useMutation(api.documents.archive);

  const onArchive = () => {
    const promise = archive({
      id: documentId,
    });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Document moved to trash",
      error: "Error moving document to trash",
    });

    router.push("/documents");
  };

  if (isArchived) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" className="h-4 w-4">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive} className="cursor-pointer">
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground">
          Last edited by: {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};
