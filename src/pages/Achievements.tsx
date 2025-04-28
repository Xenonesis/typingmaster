import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAchievements } from "@/context/AchievementsContext";
import { useAnimations } from "@/context/AnimationsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, 
  Target, 
  Zap, 
  Flame,
  Award,
  Keyboard,
  Medal,
  Clock,
  CheckCircle,
  Lock,
  Code,
  Calendar,
  Globe,
  RefreshCw,
  Search,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Map of icon names to Lucide React components
const iconMap: Record<string, React.ReactNode> = {
  'trophy': <Trophy className="h-5 w-5" />,
  'target': <Target className="h-5 w-5" />,
  'zap': <Zap className="h-5 w-5" />,
  'flame': <Flame className="h-5 w-5" />,
  'award': <Award className="h-5 w-5" />,
  'keyboard': <Keyboard className="h-5 w-5" />,
  'medal': <Medal className="h-5 w-5" />,
  'clock': <Clock className="h-5 w-5" />,
  'code': <Code className="h-5 w-5" />,
  'check-circle': <CheckCircle className="h-5 w-5" />,
  'calendar': <Calendar className="h-5 w-5" />,
  'globe': <Globe className="h-5 w-5" />
};

export default function Achievements() {
  const { achievements, refreshAchievements } = useAchievements();
  const { animationsEnabled } = useAnimations();
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // Get all categories from achievements by extracting from IDs and removing duplicates
  const categories = useMemo(() => {
    return Array.from(new Set(
      achievements.map(a => {
        const parts = a.id.split('_');
        if (parts.length > 1) {
          if (parts[0] === 'daily') return 'streak';
          return parts[0];
        }
        return 'misc';
      })
    )).sort();
  }, [achievements]);

  // Get a readable category name
  const getCategoryName = (categoryId: string): string => {
    const categoryMap: Record<string, string> = {
      'tests': 'Test Completion',
      'wpm': 'Speed',
      'accuracy': 'Accuracy',
      'streak': 'Streaks',
      'code': 'Code Typing',
      'advanced': 'Advanced Tests',
      'expert': 'Expert Tests',
      'master': 'Master Tests',
      'long': 'Endurance',
      'speed': 'Speed Burst',
      'marathon': 'Marathon',
      'ultra': 'Ultra Marathon',
      'consistent': 'Consistency',
      'improve': 'Improvement',
      'blind': 'Challenge',
      'race': 'Racing',
      'wordplay': 'Special Modes',
      'quote': 'Special Modes',
      'special': 'Special Modes',
      'night': 'Miscellaneous',
      'weekend': 'Miscellaneous',
      'global': 'Miscellaneous',
      'misc': 'Miscellaneous'
    };
    return categoryMap[categoryId] || 'Other';
  };

  // Filter and search achievements
  const filteredAchievements = useMemo(() => {
    let filtered = achievements;
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(a => {
        const parts = a.id.split('_');
        const category = parts.length > 1 ? (parts[0] === 'daily' ? 'streak' : parts[0]) : 'misc';
        return category === selectedCategory;
      });
    }
    
    // Apply tab filter
    if (activeTab === "completed") {
      filtered = filtered.filter(a => a.completed);
    } else if (activeTab === "incomplete") {
      filtered = filtered.filter(a => !a.completed);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(query) || 
        a.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [achievements, selectedCategory, activeTab, searchQuery]);

  useEffect(() => {
    setCompletedCount(achievements.filter(a => a.completed).length);
    setTotalCount(achievements.length);
  }, [achievements]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 mt-16 md:mt-20">
        <motion.div 
          className="mb-6 text-center"
          initial={animationsEnabled ? { opacity: 0, y: -20 } : false}
          animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 md:h-7 md:w-7 text-primary" />
            Achievements
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">Track your progress and unlock rewards</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <motion.div
            initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
            animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="overflow-hidden border-border/20 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <Award className="h-5 w-5 text-primary" />
                      Progress Summary
                    </CardTitle>
                    <CardDescription>Your achievement progress</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 self-end sm:self-auto"
                    onClick={refreshAchievements}
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline">Update Missions</span>
                    <span className="sm:hidden">Update</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Completed</span>
                    <span className="text-sm font-medium">{completedCount}/{totalCount}</span>
                  </div>
                  <Progress value={totalCount > 0 ? (completedCount / totalCount) * 100 : 0} className="h-2.5" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-background/50 p-3 rounded-lg border border-border/10">
                    <Badge variant="outline" className="mb-2 px-2 py-1">{completedCount}</Badge>
                    <p className="text-sm font-medium">Achievements Unlocked</p>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg border border-border/10">
                    <Badge variant="outline" className="mb-2 px-2 py-1">{totalCount - completedCount}</Badge>
                    <p className="text-sm font-medium">Remaining Challenges</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filters Bar */}
        <motion.div 
          className="mb-6 grid grid-cols-1 gap-3 sm:flex sm:items-center sm:justify-between"
          initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
          animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search achievements..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full h-9">
                <TabsTrigger value="all" className="text-xs h-7 px-3">All</TabsTrigger>
                <TabsTrigger value="completed" className="text-xs h-7 px-3">Completed</TabsTrigger>
                <TabsTrigger value="incomplete" className="text-xs h-7 px-3">Incomplete</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              variant="outline" 
              size="icon" 
              className={cn("h-9 w-9", showCategoryFilter && "bg-accent/30")}
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Category Filter */}
        <AnimatePresence>
          {showCategoryFilter && (
            <motion.div 
              className="mb-4 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ScrollArea className="w-full whitespace-nowrap pb-2">
                <div className="flex gap-2 py-2">
                  <Button 
                    variant={selectedCategory === null ? "secondary" : "outline"} 
                    size="sm" 
                    onClick={() => setSelectedCategory(null)}
                    className="h-8 text-xs"
                  >
                    All Categories
                  </Button>
                  {categories.map(category => (
                    <Button 
                      key={category}
                      variant={selectedCategory === category ? "secondary" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="h-8 text-xs"
                    >
                      {getCategoryName(category)}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <AnimatePresence>
            {filteredAchievements.length > 0 ? (
              filteredAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
                  animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
                  exit={animationsEnabled ? { opacity: 0, scale: 0.95 } : false}
                  transition={{ duration: 0.3, delay: animationsEnabled ? index * 0.05 : 0 }}
                >
                  <AchievementCard achievement={achievement} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-1 md:col-span-2 text-center py-12"
                initial={animationsEnabled ? { opacity: 0 } : false}
                animate={animationsEnabled ? { opacity: 1 } : false}
                transition={{ duration: 0.5 }}
              >
                {activeTab === "completed" ? (
                  <>
                    <Lock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Achievements Unlocked Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
                      Complete typing tests to earn achievements. Keep practicing to unlock your first achievement!
                    </p>
                  </>
                ) : activeTab === "incomplete" ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-primary/80 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">All Achievements Completed!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
                      Congratulations! You've unlocked all available achievements. Check back later for new challenges.
                    </p>
                  </>
                ) : (
                  <>
                    <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Matching Achievements</h3>
                    <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
                      Try adjusting your search or filters to find achievements.
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}

type AchievementCardProps = {
  achievement: {
    id: string;
    name: string;
    description: string;
    completed: boolean;
    icon: string;
    requirement: number;
    progress: number;
  };
};

function AchievementCard({ achievement }: AchievementCardProps) {
  const progressPercent = Math.min(
    Math.round((achievement.progress / achievement.requirement) * 100),
    100
  );

  return (
    <Card className={cn(
      "border-muted/40 transition-all duration-200 hover:shadow-md",
      achievement.completed ? "border-primary/30 bg-primary/5" : "border-muted/40"
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${achievement.completed ? 'bg-primary/20' : 'bg-muted/20'}`}>
              {iconMap[achievement.icon] || <Trophy className="h-5 w-5" />}
            </div>
            <CardTitle className="text-base md:text-lg">{achievement.name}</CardTitle>
          </div>
          {achievement.completed && (
            <Badge variant="secondary" className="bg-primary/20 text-primary-foreground text-xs">
              Completed
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs md:text-sm line-clamp-2">{achievement.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-xs md:text-sm mb-1">
            <span>Progress</span>
            <span className="font-medium">{achievement.progress}/{achievement.requirement}</span>
          </div>
          <Progress 
            value={progressPercent} 
            className="h-2" 
            indicatorClassName={achievement.completed ? "bg-primary" : ""}
          />
        </div>
      </CardContent>
    </Card>
  );
}