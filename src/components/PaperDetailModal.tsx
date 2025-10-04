import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, BookOpen, Users, Calendar, Rocket, FlaskConical, Quote } from 'lucide-react';
import { ResearchPaper } from '@/types/dashboard';

interface PaperDetailModalProps {
  paper: ResearchPaper | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaperDetailModal({ paper, open, onOpenChange }: PaperDetailModalProps) {
  if (!paper) return null;

  const pubmedUrl = paper.pubmedLink || `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(paper.title)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold leading-tight pr-8">
            {paper.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Research paper details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              {paper.organismType}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Calendar className="h-3 w-3 mr-1" />
              {paper.year}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Rocket className="h-3 w-3 mr-1" />
              {paper.mission}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <FlaskConical className="h-3 w-3 mr-1" />
              {paper.experimentType}
            </Badge>
          </div>

          <Separator />

          {/* Authors */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Authors</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {paper.authors.join(', ')}
            </p>
          </div>

          <Separator />

          {/* Abstract */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Quote className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Abstract</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {paper.abstract}
            </p>
          </div>

          <Separator />

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Citations</p>
              <p className="text-2xl font-bold text-foreground">{paper.citations}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Impact Score</p>
              <p className="text-2xl font-bold text-foreground">{paper.impact}</p>
            </div>
          </div>

          {/* Keywords */}
          {paper.keywords.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {paper.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Action Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={() => window.open(pubmedUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Publication on PubMed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
