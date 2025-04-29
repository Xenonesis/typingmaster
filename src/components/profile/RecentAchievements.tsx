import { useEffect, useState } from "react";
import { useAchievements } from "@/context/AchievementsContext";
import { Trophy, Award, Medal, ChevronRight } from "lucide-react";
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Recent Achievements
        </CardTitle>
        <CardDescription>Your latest typing accomplishments</CardDescription>
      </CardHeader>
      <CardContent>
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
                className="flex items-center gap-3 p-3 rounded-md bg-secondary/10 border border-border/20"
              >
                <div className="p-2 rounded-full bg-primary/10">
                  {iconMap[achievement.icon] || <Trophy className="h-4 w-4 text-primary/80" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{achievement.name}</h4>
                    <Badge variant="outline" className="text-xs bg-primary/10">
                      {achievement.completed_at ? new Date(achievement.completed_at).toLocaleDateString() : "Completed"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <Trophy className="h-10 w-10 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No achievements unlocked yet</p>
            <p className="text-xs text-muted-foreground mt-1">Keep practicing to earn achievements</p>
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 flex items-center justify-center gap-1"
          onClick={handleViewAllClick}
        >
          View All Achievements
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
} 