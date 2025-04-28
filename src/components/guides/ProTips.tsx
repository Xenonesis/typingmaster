import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Award, Lightbulb, Keyboard, Timer, BookOpen, ArrowRight, Crown, Star } from "lucide-react";

export const ProTips = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">View Tips</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Award className="h-5 w-5 text-primary" />
            Pro Tips & Tricks: Expert Advice
          </DialogTitle>
          <DialogDescription>
            Advanced insights from top typists to help you break through plateaus and reach your peak performance.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />
        <ScrollArea className="h-[calc(80vh-120px)] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                <Crown className="h-4 w-4 text-primary" />
                Expert Mindsets
              </h3>
              <p className="text-muted-foreground mb-4">
                Elite typists approach typing differently than beginners. Adopting these mindsets can dramatically
                improve your performance.
              </p>
              <div className="space-y-4 mb-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1.5">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Think Ahead, Not Behind</h4>
                      <p className="text-sm text-muted-foreground">
                        Professional typists focus on reading ahead, not on the characters they're currently typing.
                        Train yourself to look 4-8 words ahead of your current typing position.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1.5">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Internalize the Keyboard</h4>
                      <p className="text-sm text-muted-foreground">
                        Top typists don't think about key locations – they've internalized the keyboard to the point
                        where typing is as natural as speaking. Achieve this through consistent daily practice.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1.5">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Embrace Deliberate Practice</h4>
                      <p className="text-sm text-muted-foreground">
                        Don't just type – practice with intention. Focus on specific aspects of your typing that need
                        improvement, whether it's accuracy on certain keys, finger positioning, or rhythm.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                <Keyboard className="h-4 w-4 text-primary" />
                Advanced Keyboard Techniques
              </h3>
              <p className="text-muted-foreground mb-4">
                These nuanced techniques can help experienced typists reach new levels of speed and efficiency.
              </p>
              <div className="space-y-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Minimal Force Typing</h4>
                  <p className="text-sm text-muted-foreground">
                    Use only the minimum force needed to register keystrokes. Excessive pressure wastes energy and
                    slows down your fingers. Practice typing as if the keys are hot – quick, light touches.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Optimized Shift Key Usage</h4>
                  <p className="text-sm text-muted-foreground">
                    Always use the opposite hand's shift key from the letter being capitalized. For example, for a 
                    capital "T", use the left shift with your right hand on the letter.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Dead Key Elimination</h4>
                  <p className="text-sm text-muted-foreground">
                    Identify your "dead keys" – keys that consistently slow you down or cause errors. Create custom 
                    drills focused entirely on these keys until they're no longer a bottleneck.
                  </p>
                </div>
                <div className="bg-accent/5 p-4 rounded-lg border border-accent/20 mt-4">
                  <p className="text-sm">
                    <strong>Expert Exercise:</strong> Record yourself typing from above (or use a typing analyzer) 
                    to identify inefficient finger movements. Focus on eliminating any unnecessary hand repositioning
                    or stretching.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                <Timer className="h-4 w-4 text-primary" />
                Speed-Building Secrets
              </h3>
              <p className="text-muted-foreground mb-4">
                These specialized techniques are particularly effective for breaking through speed barriers and reaching
                the coveted 100+ WPM range.
              </p>
              <div className="space-y-4 mb-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 bg-accent/10 rounded-full p-1.5">
                      <Star className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">The "N+10" Method</h4>
                      <p className="text-sm text-muted-foreground">
                        Practice typing at your current maximum WPM + 10. You'll make mistakes, but this overreaching
                        trains your brain and fingers to operate at higher speeds. After 10 minutes of this, return to
                        your normal speed, which will now feel easier.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 bg-accent/10 rounded-full p-1.5">
                      <Star className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Interval Training</h4>
                      <p className="text-sm text-muted-foreground">
                        Type for 1 minute at maximum speed, rest for 30 seconds, repeat 5 times. This high-intensity
                        interval training builds both speed and endurance while preventing fatigue-induced mistakes.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 bg-accent/10 rounded-full p-1.5">
                      <Star className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">The "Sprints and Marathon" Technique</h4>
                      <p className="text-sm text-muted-foreground">
                        Alternate between very short (15-second) bursts of all-out typing speed and longer (5-minute)
                        sessions of steady, controlled typing. This develops both your maximum burst capability and
                        your endurance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="text-sm italic">
                  <strong>Pro Insight:</strong> Many top typists report that their biggest speed improvements came
                  when they stopped focusing on speed itself and instead concentrated on rhythm, smoothness, and
                  reading ahead. Speed becomes a byproduct of good technique rather than the primary goal.
                </p>
              </div>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-primary" />
                Customization for Peak Performance
              </h3>
              <p className="text-muted-foreground mb-4">
                Top typists often customize their setup and practice routines to their specific needs. Here are some
                approaches to consider:
              </p>
              <div className="space-y-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Keyboard Customization</h4>
                  <p className="text-sm text-muted-foreground">
                    Experiment with different keyboards to find what works best for you. Some prefer mechanical keyboards
                    with specific switch types (Cherry MX Brown for a balance of typing feel and noise, for example),
                    while others prefer low-profile laptop-style keys. Find what feels most natural to you.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Content-Specific Training</h4>
                  <p className="text-sm text-muted-foreground">
                    If you type in a specific field (programming, medical transcription, legal documents), practice with
                    content from that domain. The specialized vocabulary and patterns will help you develop muscle memory
                    specific to your needs.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Environmental Optimization</h4>
                  <p className="text-sm text-muted-foreground">
                    Create an optimal typing environment: proper lighting, ergonomic chair and desk height, minimal
                    distractions, and comfort. Elite performance requires ideal conditions.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator />
            
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Ready to put these pro tips into practice? Return to TypeSpeed Master and test your new skills!
              </p>
              <Button variant="default" size="sm" className="mx-auto" asChild>
                <a href="#/typing-test" className="flex items-center gap-1">
                  Apply These Tips <ArrowRight className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}; 