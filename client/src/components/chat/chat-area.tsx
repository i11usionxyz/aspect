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
