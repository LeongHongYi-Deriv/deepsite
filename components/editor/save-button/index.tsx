import { Button } from "@/components/ui/button";
import { MdSave } from "react-icons/md";

// REMOVED - All Hugging Face dependencies  
// import { useRouter } from "next/navigation";
// import { Page } from "@/types";

export function SaveButton() {
  const handleClick = () => {
    // Show info about disabled feature
    alert("Project saving disabled - was dependent on Hugging Face Spaces.\n\nYou can still:\n• Generate websites with AI\n• Edit code manually\n• Copy/export HTML for hosting elsewhere");
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleClick}
      disabled
      className="cursor-not-allowed opacity-50"
    >
      <MdSave className="size-4" />
      Save (Disabled)
    </Button>
  );
}
