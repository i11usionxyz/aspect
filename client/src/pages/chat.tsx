import { useParams } from "wouter";
import { useState } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/chat/sidebar";
import ChatArea from "@/components/chat/chat-area";

export default function Chat() {
  const { id: conversationId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          currentConversationId={conversationId}
        />
        <ChatArea 
          conversationId={conversationId}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </main>
    </div>
  );
}
