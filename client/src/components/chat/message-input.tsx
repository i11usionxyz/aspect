import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, RotateCcw, Smile } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TypingIndicator from "./typing-indicator";

interface MessageInputProps {
  conversationId?: string;
  onMessageSent: () => void;
}

export default function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [, setLocation] = useLocation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      const response = await apiRequest("POST", `/api/conversations/${conversationId}/messages`, {
        content,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/conversations", conversationId, "messages"] 
      });
      onMessageSent();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const createAndSendMutation = useMutation({
    mutationFn: async (content: string) => {
      // First create a conversation
      const conversationResponse = await apiRequest("POST", "/api/conversations", {
        title: "New Conversation",
      });
      const conversation = await conversationResponse.json();
      
      // Then send the message
      const messageResponse = await apiRequest("POST", `/api/conversations/${conversation.id}/messages`, {
        content,
      });
      
      return { conversation, messages: await messageResponse.json() };
    },
    onSuccess: (data) => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setLocation(`/chat/${data.conversation.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    if (conversationId) {
      sendMessageMutation.mutate({ conversationId, content: message.trim() });
    } else {
      createAndSendMutation.mutate(message.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearConversation = () => {
    if (conversationId) {
      setLocation("/");
    }
  };

  const isLoading = sendMessageMutation.isPending || createAndSendMutation.isPending;

  return (
    <div className="bg-card border-t border-border px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div className="max-w-4xl mx-auto">
        {isLoading && (
          <div className="mb-4">
            <TypingIndicator />
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex items-end space-x-2 sm:space-x-3 md:space-x-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            data-testid="button-attach"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="resize-none min-h-[44px] sm:min-h-[48px] max-h-28 sm:max-h-32 pr-10 sm:pr-12 text-sm sm:text-base"
              disabled={isLoading}
              data-testid="textarea-message"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8"
              data-testid="button-emoji"
            >
              <Smile className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="flex-shrink-0"
            data-testid="button-send"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>

        <div className="flex items-center justify-between mt-2 sm:mt-3 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
            <span className="sm:hidden truncate">Enter to send</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <span data-testid="text-character-count" className="text-xs">{message.length}/4000</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 sm:h-6 sm:w-6"
              onClick={clearConversation}
              data-testid="button-clear"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
