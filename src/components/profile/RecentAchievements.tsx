import { useEffect, useState } from "react";
import { useAchievements } from "@/context/AchievementsContext";
import { Trophy, Award, Medal, ChevronRight, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const iconMap: Record<string, JSX.Element> = {
  'trophy': <Trophy className="h-4 w-4 text-primary/80" />,
  'medal': <Medal className="h-4 w-4 text-primary/80" />,
  'award': <Award className="h-4 w-4 text-primary/80" />,
};

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  completed: boolean;
  requirement: number;
  progress: number;
  completed_at?: string | null;
}

export function RecentAchievements() {
  const { achievements, isLoading } = useAchievements();
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (achievements.length > 0) {
      // Get only completed achievements
      const completed = achievements.filter(a => a.completed);
      
      // Sort by completed_at date (most recent first)
      const sorted = [...completed].sort((a, b) => {
        const dateA = a.completed_at ? new Date(a.completed_at).getTime() : 0;
        const dateB = b.completed_at ? new Date(b.completed_at).getTime() : 0;
        return dateB - dateA;
      });
      
      // Get the 3 most recent achievements
      setRecentAchievements(sorted.slice(0, 3));
    }
  }, [achievements]);

  const handleViewAllClick = () => {
    navigate('/achievements');
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Completed";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className="shadow-card border-border/30">
      <CardHeader className="bg-background/50 pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Recent Achievements
        </CardTitle>
        <CardDescription>Your latest typing accomplishments</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : recentAchievements.length > 0 ? (
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className="flex items-center gap-3 p-3 rounded-md bg-gradient-to-br from-primary/5 to-primary/10 border border-border/30"
              >
                <div className="p-2 rounded-full bg-primary/20">
                  {iconMap[achievement.icon] || <Trophy className="h-4 w-4 text-primary/80" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{achievement.name}</h4>
                    <Badge variant="outline" className="text-xs bg-primary/10 flex items-center gap-1 whitespace-nowrap ml-2">
                      <Calendar className="h-3 w-3" />
                      {formatDate(achievement.completed_at)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground font-medium">No achievements yet</p>
            <p className="text-xs text-muted-foreground mt-1 text-center max-w-[200px]">
              Keep practicing to unlock achievements and track your progress
            </p>
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 flex items-center justify-center gap-1 hover:bg-primary/5"
          onClick={handleViewAllClick}
        >
          View All Achievements
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
} 