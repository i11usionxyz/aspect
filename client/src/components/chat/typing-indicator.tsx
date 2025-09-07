export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-secondary-foreground text-sm">🤖</span>
        </div>
        <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-md material-elevation-1">
          <div className="flex space-x-1" data-testid="typing-indicator">
            <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
