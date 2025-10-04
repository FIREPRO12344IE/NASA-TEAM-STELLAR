import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChevronDown, ChevronUp, Leaf, Bug, Microscope } from 'lucide-react';
import { ResearchPaper } from '@/types/dashboard';

interface ResearchCardProps {
  paper: ResearchPaper;
}

export function ResearchCard({ paper }: ResearchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getOrganismIcon = () => {
    switch (paper.organismType) {
      case 'Plant': return <Leaf className="h-4 w-4 text-nasa-green" />;
      case 'Animal': return <Bug className="h-4 w-4 text-nasa-blue" />;
      case 'Microbe': return <Microscope className="h-4 w-4 text-nasa-orange" />;
      default: return null;
    }
  };

  const getOrganismColor = () => {
    switch (paper.organismType) {
      case 'Plant': return 'border-nasa-green/30 hover:border-nasa-green/50';
      case 'Animal': return 'border-nasa-blue/30 hover:border-nasa-blue/50';
      case 'Microbe': return 'border-nasa-orange/30 hover:border-nasa-orange/50';
      default: return 'border-border';
    }
  };

  const pubmedUrl = paper.pubmedLink || `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(paper.title)}`;

  return (
    <Card 
      className={`transition-all duration-300 cursor-pointer ${getOrganismColor()} ${
        isExpanded ? 'ring-2 ring-primary/20 shadow-lg' : 'hover:shadow-md'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {getOrganismIcon()}
              <h3 className="font-semibold text-foreground leading-tight line-clamp-2">
                {paper.title}
              </h3>
            </div>
            
            {!isExpanded && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {paper.abstract}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {paper.organismType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {paper.year}
              </Badge>
              {isExpanded && (
                <>
                  <Badge variant="outline" className="text-xs">
                    {paper.experimentType}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {paper.mission}
                  </Badge>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-3 animate-in fade-in duration-300">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Abstract</h4>
              <p className="text-sm text-muted-foreground">
                {paper.abstract}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Authors</h4>
              <p className="text-sm text-muted-foreground">
                {paper.authors.join(', ')}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Citations: </span>
                <span className="font-medium text-foreground">{paper.citations}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Impact: </span>
                <span className="font-medium text-foreground">{paper.impact}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {paper.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>

            <Button
              variant="default"
              size="sm"
              className="w-full mt-2"
              onClick={(e) => {
                e.stopPropagation();
                window.open(pubmedUrl, '_blank');
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Publication
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
