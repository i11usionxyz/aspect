import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Conversation } from "@shared/schema";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  currentConversationId?: string;
}

export default function Sidebar({ open, onClose, currentConversationId }: SidebarProps) {
  const [, setLocation] = useLocation();
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/conversations", {
        title: "New Conversation",
      });
      return response.json();
    },
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setLocation(`/chat/${newConversation.id}`);
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create conversation",
        variant: "destructive",
      });
    },
  });

  const handleNewConversation = () => {
    createConversationMutation.mutate();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-80 sm:w-84 md:w-80 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:transform-none",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "lg:block"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end p-3 sm:p-4">
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-sidebar">
              <X className="h-5 w-5" />
            </Button>
          </div>


          {/* Conversations */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewConversation}
                disabled={createConversationMutation.isPending}
                data-testid="button-new-conversation"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-muted rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">
                    No conversations yet
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleNewConversation}
                    disabled={createConversationMutation.isPending}
                    data-testid="button-start-conversation"
                  >
                    Start a conversation
                  </Button>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <Link key={conversation.id} href={`/chat/${conversation.id}`}>
                    <div
                      className={cn(
                        "p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent",
                        currentConversationId === conversation.id && "bg-accent"
                      )}
                      onClick={onClose}
                      data-testid={`conversation-${conversation.id}`}
                    >
                      <h3 className="font-medium text-sm text-foreground truncate">
                        {conversation.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
