import { Button } from "@/components/ui/button";
import { Menu, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-card material-elevation-4 sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden flex-shrink-0"
              onClick={onMenuClick}
              data-testid="button-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-lg sm:text-xl">🤖</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">AI Assistant</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden xs:block">Powered by Gemini</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline" data-testid="status-connection">
                Connected
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
