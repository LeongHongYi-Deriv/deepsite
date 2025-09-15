"use client";
import { Button } from "@/components/ui/button";

// REMOVED - All Hugging Face dependencies
// import { useState } from "react";
// import { useUser } from "@/hooks/useUser";
// import { Project } from "@/types";
// import { ProjectCard } from "./project-card";
// import { LoadProject } from "./load-project";

export function MyProjects() {
  const handleClick = () => {
    alert("My Projects disabled - was dependent on Hugging Face Spaces.\n\nThis feature required authentication and stored projects as HF Spaces.\n\nUse the main editor at /projects/new for AI generation!");
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">My Projects (Disabled)</h1>
      <p className="text-gray-600 mb-6">
        Project management was dependent on Hugging Face Spaces and authentication.
      </p>
      <div className="space-y-4">
        <Button onClick={handleClick} disabled variant="outline">
          My Projects Feature Disabled
        </Button>
        <div className="text-sm text-gray-500">
          <p>💡 You can still:</p>
          <p>• Generate websites with AI at /projects/new</p>
          <p>• Edit code in the Monaco editor</p>
          <p>• Copy/export HTML for hosting elsewhere</p>
        </div>
      </div>
    </div>
  );
}
