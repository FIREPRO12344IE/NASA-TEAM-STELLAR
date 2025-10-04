import { Card } from '@/components/ui/card';
import { Sparkles, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface AISummaryCardProps {
  summary?: string;
  explanation?: string;
  isSearching: boolean;
  hasResults: boolean;
  searchQuery: string;
}

export function AISummaryCard({ 
  summary, 
  explanation, 
  isSearching, 
  hasResults,
  searchQuery 
}: AISummaryCardProps) {
  if (!searchQuery && !isSearching) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {isSearching ? (
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              ) : (
                <Info className="w-6 h-6 text-primary" />
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Research Insights
            </h3>
            
            {isSearching ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
              </div>
            ) : summary ? (
              <div className="space-y-3">
                <p className="text-base leading-relaxed font-medium">{summary}</p>
                {explanation && (
                  <p className="text-sm text-muted-foreground">
                    {explanation}
                  </p>
                )}
                {!hasResults && (
                  <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-foreground">
                      💡 <strong>No direct results found</strong>, but here's what we found related to your query. Try broader search terms or explore using the filters on the left.
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
