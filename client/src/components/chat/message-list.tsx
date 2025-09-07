import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import TypingIndicator from "./typing-indicator";
import type { Message } from "@shared/schema";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  conversationId?: string;
}

export default function MessageList({ messages, isLoading, conversationId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Message content copied successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy message to clipboard",
        variant: "destructive",
      });
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center px-3 sm:px-4 md:px-6">
        <div className="text-center py-6 sm:py-8 max-w-md mx-auto px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <span className="text-primary text-xl sm:text-2xl">🧠</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
            Welcome to AI Assistant
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            I'm here to help you with any questions or tasks. Start a conversation by selecting one from the sidebar or creating a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 scrollbar-thin"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {isLoading && messages.length === 0 ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-6 sm:py-8 px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-primary text-xl sm:text-2xl">💬</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
              Start the conversation
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Type a message below to begin chatting with the AI assistant.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "message-bubble flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
              data-testid={`message-${message.role}-${message.id}`}
            >
              <div className="max-w-3xl">
                {message.role === "user" ? (
                  <div>
                    <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md material-elevation-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <div className="flex items-center justify-end space-x-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-secondary-foreground text-sm">🤖</span>
                    </div>
                    <div>
                      <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-md material-elevation-1">
                        <div className="text-sm text-foreground whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(message.content)}
                          data-testid={`button-copy-${message.id}`}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          data-testid={`button-like-${message.id}`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          data-testid={`button-dislike-${message.id}`}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
