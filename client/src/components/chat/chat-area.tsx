import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Menu, MoreVertical } from "lucide-react";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import type { Message } from "@shared/schema";

interface ChatAreaProps {
  conversationId?: string;
  onMenuClick: () => void;
}

export default function ChatArea({ conversationId, onMenuClick }: ChatAreaProps) {
  const { data: messages = [], isLoading, refetch } = useQuery<Message[]>({
    queryKey: ["/api/conversations", conversationId, "messages"],
    enabled: !!conversationId,
  });

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Mobile header */}
      <div className="bg-card border-b border-border px-6 py-4 lg:hidden">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClick}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">AI Assistant</h1>
          <Button variant="ghost" size="icon" data-testid="button-mobile-more">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        conversationId={conversationId}
      />

      {/* Message input */}
      <MessageInput
        conversationId={conversationId}
        onMessageSent={() => refetch()}
      />
    </div>
  );
}
