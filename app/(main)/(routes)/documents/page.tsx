"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({
      title: "Untitled Document",
    }).then((documentId) => {
      router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: "Creating a new document...",
      success: "Document created successfully!",
      error: "Failed to create a new document.",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        alt="Empty"
        width={300}
        height={300}
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        alt="Empty"
        width={300}
        height={300}
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName || "Your"}&apos;s Documents
      </h2>
      <Button onClick={onCreate} className="cursor-pointer">
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a document
      </Button>
    </div>
  );
};

export default DocumentsPage;
