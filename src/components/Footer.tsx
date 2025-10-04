import { ExternalLink, Github, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">NASA Lifelens Dashboard</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Advanced analytics platform for NASA space biology research, 
              enabling scientists to explore and understand life sciences data 
              from space missions and experiments.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="https://nasa.gov" target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  NASA.gov
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <div className="space-y-2">
              <a 
                href="https://www.nasa.gov/mission_pages/station/research/index.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ISS Research
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <a 
                href="https://astrobiology.nasa.gov/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                NASA Astrobiology
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <a 
                href="https://www.nasa.gov/audience/forstudents/5-8/features/nasa-knows/what-is-microgravity-58.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Microgravity Research
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <a 
                href="https://www.nasa.gov/centers/ames/research/life-sciences/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Life Sciences Division
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>

          {/* Contact & Credits */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact & Credits</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Built with cutting-edge research data and visualization technologies
              </p>
              <div className="flex flex-col gap-2">
                <a 
                  href="mailto:research@nasa.gov" 
                  className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  research@nasa.gov
                </a>
                <a 
                  href="https://github.com/nasa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4 mr-2" />
                  NASA Open Source
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} NASA Lifelens Dashboard. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Powered by React</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>Recharts</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}