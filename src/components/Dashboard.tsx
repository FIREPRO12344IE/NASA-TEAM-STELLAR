import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Users, BookOpen, Microscope } from 'lucide-react';
import { FilterState, ResearchPaper } from '@/types/dashboard';
import { ResearchCard } from './ResearchCard';

interface DashboardProps {
  papers: ResearchPaper[];
  filters: FilterState;
  aiFilteredPaperIds?: string[] | null;
}

export function Dashboard({ papers, filters, aiFilteredPaperIds }: DashboardProps) {
  const filteredPapers = useMemo(() => {
    let filtered = papers.filter(paper => {
      const matchesOrganism = filters.organismType.length === 0 || 
        filters.organismType.includes(paper.organismType);
      
      const matchesExperiment = filters.experimentType.length === 0 || 
        filters.experimentType.includes(paper.experimentType);
      
      const matchesYear = paper.year >= filters.yearRange[0] && 
        paper.year <= filters.yearRange[1];
      
      const matchesMission = filters.mission.length === 0 || 
        filters.mission.includes(paper.mission);

      return matchesOrganism && matchesExperiment && matchesYear && matchesMission;
    });

    // If AI search is active and we have filtered IDs, apply AI ranking
    if (aiFilteredPaperIds && aiFilteredPaperIds.length > 0 && filters.searchQuery) {
      // Sort papers by AI relevance
      filtered = filtered
        .filter(paper => aiFilteredPaperIds.includes(paper.id))
        .sort((a, b) => {
          const indexA = aiFilteredPaperIds.indexOf(a.id);
          const indexB = aiFilteredPaperIds.indexOf(b.id);
          return indexA - indexB;
        });
    } else if (filters.searchQuery) {
      // Fallback to basic search if AI search isn't available
      filtered = filtered.filter(paper =>
        paper.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        paper.keywords.some(keyword => 
          keyword.toLowerCase().includes(filters.searchQuery.toLowerCase())
        )
      );
    }

    return filtered;
  }, [papers, filters, aiFilteredPaperIds]);

  // Chart data processing
  const organismData = useMemo(() => {
    const counts = filteredPapers.reduce((acc, paper) => {
      acc[paper.organismType] = (acc[paper.organismType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredPapers]);

  const yearlyData = useMemo(() => {
    const counts = filteredPapers.reduce((acc, paper) => {
      acc[paper.year] = (acc[paper.year] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(counts)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);
  }, [filteredPapers]);

  const impactData = useMemo(() => {
    return filteredPapers.map(paper => ({
      title: paper.title.substring(0, 30) + '...',
      impact: paper.impact,
      citations: paper.citations
    })).sort((a, b) => b.impact - a.impact).slice(0, 10);
  }, [filteredPapers]);

  const missionData = useMemo(() => {
    const counts = filteredPapers.reduce((acc, paper) => {
      acc[paper.mission] = (acc[paper.mission] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredPapers]);

  const totalCitations = filteredPapers.reduce((sum, paper) => sum + paper.citations, 0);
  const avgImpact = filteredPapers.length > 0 
    ? (filteredPapers.reduce((sum, paper) => sum + paper.impact, 0) / filteredPapers.length).toFixed(1)
    : 0;

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="p-6 space-y-6">

      {/* Enhanced Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card bg-gradient-to-br from-nasa-orange/10 to-nasa-orange/5 border-nasa-orange/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Papers</p>
                <p className="text-3xl font-bold text-nasa-orange">{filteredPapers.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Research publications</p>
              </div>
              <div className="p-3 bg-nasa-orange/10 rounded-full">
                <BookOpen className="h-6 w-6 text-nasa-orange" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card bg-gradient-to-br from-nasa-blue/10 to-nasa-blue/5 border-nasa-blue/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Citations</p>
                <p className="text-3xl font-bold text-nasa-blue">{totalCitations.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Academic references</p>
              </div>
              <div className="p-3 bg-nasa-blue/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-nasa-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card bg-gradient-to-br from-nasa-green/10 to-nasa-green/5 border-nasa-green/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Impact</p>
                <p className="text-3xl font-bold text-nasa-green">{avgImpact}</p>
                <p className="text-xs text-muted-foreground mt-1">Research impact score</p>
              </div>
              <div className="p-3 bg-nasa-green/10 rounded-full">
                <Microscope className="h-6 w-6 text-nasa-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card bg-gradient-to-br from-nasa-yellow/10 to-nasa-yellow/5 border-nasa-yellow/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Missions</p>
                <p className="text-3xl font-bold text-nasa-yellow">
                  {new Set(filteredPapers.map(p => p.mission)).size}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Space missions</p>
              </div>
              <div className="p-3 bg-nasa-yellow/10 rounded-full">
                <Users className="h-6 w-6 text-nasa-yellow" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Organism Distribution */}
        <Card className="chart-container">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                🧬 Research by Organism Type
              </CardTitle>
              <p className="text-sm text-muted-foreground">Distribution across life forms</p>
            </div>
            <Button variant="ghost" size="sm" className="btn-enhanced">
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={organismData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--card-border))"
                  strokeWidth={2}
                >
                  {organismData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Research Timeline */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Research Timeline</CardTitle>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mission Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Research by Mission</CardTitle>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={missionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* High Impact Research */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">High Impact Research</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-300 overflow-y-auto">
              {impactData.slice(0, 6).map((paper, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {paper.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        Impact: {paper.impact}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {paper.citations} citations
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Papers - Interactive Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Research Papers</CardTitle>
          <p className="text-sm text-muted-foreground">Click any card to expand and view details</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredPapers.slice(0, 6).map((paper) => (
              <ResearchCard key={paper.id} paper={paper} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}