import { useState } from 'react';
import { Search, Menu, Moon, Sun, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import nasaLogo from '@/assets/nasa-lifelens-logo.png';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onMenuToggle: () => void;
  isAISearching?: boolean;
}

export function Header({ onSearchChange, searchQuery, onMenuToggle, isAISearching = false }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <img 
              src={nasaLogo} 
              alt="NASA STELLAR" 
              className="h-10 w-10 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-nasa-orange via-nasa-blue to-nasa-green bg-clip-text text-transparent">
                NASA STELLAR
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block font-medium">
                AI Space Biology Insights
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
          <div className="relative flex-1 search-enhanced rounded-md">
            {isAISearching ? (
              <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-nasa-orange animate-pulse transition-colors duration-300" />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-300" />
            )}
            <Input
              placeholder="Search anything: missions, organisms, experiments, authors..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-muted/30 border-border hover:bg-muted/50 focus:bg-card transition-all duration-300 text-base"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative btn-enhanced hover:bg-primary/10"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-nasa-orange transition-colors duration-300" />
            ) : (
              <Moon className="h-4 w-4 text-nasa-blue transition-colors duration-300" />
            )}
          </Button>
          
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span>NASA</span>
            <div className="w-1 h-1 bg-primary rounded-full"></div>
            <span>Astrobiology</span>
          </div>
        </div>
      </div>
    </header>
  );
}