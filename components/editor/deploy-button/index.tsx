/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { MdSave } from "react-icons/md";
// import { Page } from "@/types"; // REMOVED - not needed in disabled version

// REMOVED - All Hugging Face dependencies
// import { LoginModal } from "@/components/login-modal";
// import { useUser } from "@/hooks/useUser";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { DeployButtonContent } from "./content";

export function DeployButton() {
  const handleClick = () => {
    // Show info about disabled feature
    alert("Project publishing disabled - was dependent on Hugging Face Spaces.\n\nYou can still:\n• Generate websites with AI\n• Edit code manually\n• Copy/export HTML for hosting elsewhere");
  };

  return (
    <div className="flex items-center justify-end gap-5">
      <div className="relative flex items-center justify-end">
        <Button 
          variant="outline" 
          className="max-lg:hidden !px-4 cursor-not-allowed opacity-50" 
          onClick={handleClick}
          disabled
        >
          <MdSave className="size-4" />
          Publish your Project (Disabled)
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="lg:hidden cursor-not-allowed opacity-50"
          onClick={handleClick}
          disabled
        >
          Publish (Disabled)
        </Button>
      </div>
    </div>
  );
}
