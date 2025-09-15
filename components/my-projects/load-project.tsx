"use client";
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";

// REMOVED - All Hugging Face dependencies
// import { useState } from "react";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { useUser } from "@/hooks/useUser";
// import { LoginModal } from "../login-modal";
// import { api } from "@/lib/api";
// import { Project } from "@/types";
// import Loading from "../loading";

export const LoadProject = ({
  fullXsBtn = false,
}: {
  fullXsBtn?: boolean;
}) => {
  const handleClick = () => {
    alert("Project loading disabled - was dependent on Hugging Face Spaces.\n\nThis feature required authentication and access to Hugging Face Spaces.\n\nYou can start fresh with the AI generator!");
  };

  return (
    <>
      <Button
        variant="outline"
        className="max-lg:hidden cursor-not-allowed opacity-50"
        onClick={handleClick}
        disabled
      >
        <Import className="size-4 mr-1.5" />
        Load existing Project (Disabled)
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden cursor-not-allowed opacity-50"
        onClick={handleClick}
        disabled
      >
        {fullXsBtn && <Import className="size-3.5 mr-1" />}
        Load
        {fullXsBtn && " existing Project"} (Disabled)
      </Button>
    </>
  );
};
