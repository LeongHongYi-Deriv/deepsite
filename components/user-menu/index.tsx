import { Button } from "@/components/ui/button";

// REMOVED - All Hugging Face authentication dependencies
// import { useUser } from "@/hooks/useUser";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { LogOut, User, CreditCard, ExternalLink } from "lucide-react";

export function UserMenu({ className }: { className?: string }) {
  return (
    <Button variant="outline" size="sm" className={className} disabled>
      👤 Local User (No Auth)
    </Button>
  );
}
