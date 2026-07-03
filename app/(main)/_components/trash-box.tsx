"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);
  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((doc) => {
    return doc.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">,
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring document...",
      success: "Document restored",
      error: "Error restoring document",
    });
  };
  const onRemove = (documentId: Id<"documents">) => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Removing document...",
      success: "Document removed",
      error: "Error removing document",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents in trash
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onClick(document._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2 cursor-pointer">
              {document.title}
            </span>
            <div className="flex items-center">
              <div
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer"
                onClick={(e) => onRestore(e, document._id)}
                role="button"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer"
                  role="button"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrashBox;
