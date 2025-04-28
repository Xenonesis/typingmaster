import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Rocket, Zap, Watch, Target, BarChart2, ArrowRight } from "lucide-react";

export const SpeedTechniques = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Rocket className="h-5 w-5 text-primary" />
            Speed Techniques: Break Your Typing Barriers
          </DialogTitle>
          <DialogDescription>
            Advanced methods to increase your typing speed without sacrificing accuracy.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />
        <ScrollArea className="h-[calc(80vh-120px)] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-primary" />
                The Speed-Accuracy Balance
              </h3>
              <p className="text-muted-foreground mb-4">
                Finding the right balance between speed and accuracy is crucial for effective typing. 
                Too much focus on either can hinder your overall performance.
              </p>
              <div className="bg-card p-4 rounded-lg border border-border mb-4">
                <h4 className="font-medium mb-2">Building Speed Safely</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Follow this progression to increase speed without developing bad habits:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Master accuracy first</strong> — Aim for 95%+ accuracy at your current speed
                  </li>
                  <li>
                    <strong>Gradually increase speed</strong> — Push yourself 5-10% faster than your comfortable speed
                  </li>
                  <li>
                    <strong>Plateau and consolidate</strong> — Practice at the new speed until it feels natural
                  </li>
                  <li>
                    <strong>Repeat the cycle</strong> — Continue this process of incremental improvement
                  </li>
                </ol>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="text-sm italic">
                  <strong>Technique Tip:</strong> When practicing for speed, it's better to make a mistake and continue 
                  typing than to stop and correct errors. This builds flow and rhythm, essential components of fast typing.
                </p>
              </div>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                <Watch className="h-4 w-4 text-primary" />
                Rhythm and Flow Techniques
              </h3>
              <p className="text-muted-foreground mb-4">
                Developing a consistent typing rhythm helps reduce hesitation and increases overall speed.
                These techniques will help you establish a smooth, flowing typing pattern.
              </p>
              <div className="space-y-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Burst Typing</h4>
                  <p className="text-sm text-muted-foreground">
                    Practice typing in short, focused bursts of 20-30 seconds at maximum speed, followed by a brief rest.
                    This trains your fingers to move quickly while minimizing fatigue.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Metronome Practice</h4>
                  <p className="text-sm text-muted-foreground">
                    Use a metronome app set to 60-80 BPM and try to type one character on each beat. 
                    Gradually increase the tempo as you become comfortable.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Word Chunking</h4>
                  <p className="text-sm text-muted-foreground">
                    Instead of thinking letter by letter, practice visualizing and typing entire words or common 
                    letter combinations (like "ing," "the," "and") as single units.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-primary" />
                Targeted Practice Strategies
              </h3>
              <p className="text-muted-foreground mb-4">
                General typing practice is useful, but targeted exercises can help you overcome specific weaknesses 
                and push through speed plateaus.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Isolate Problem Keys</h4>
                  <p className="text-sm text-muted-foreground">
                    Identify keys or key combinations that slow you down and create custom exercises that heavily 
                    use these characters. Practice these drills for 5-10 minutes daily.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">N-gram Practice</h4>
                  <p className="text-sm text-muted-foreground">
                    Focus on common 2, 3, and 4-letter combinations (bigrams, trigrams, and n-grams) to build finger 
                    memory for transitions between keys that frequently occur together.
                  </p>
                </div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border mb-4">
                <h4 className="font-medium mb-2">Finger Dexterity Exercises</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  These exercises strengthen your fingers and improve their independence:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><code>asdf jkl;</code> — Basic home row warmup</li>
                  <li><code>asdf fdsa jkl; ;lkj</code> — Forward and backward home row</li>
                  <li><code>asdfg gfdsa</code> and <code>jkl;' ';lkj</code> — Extended home row</li>
                  <li><code>qazwsx edcrfv tgbyhn ujmik,ol.p/</code> — Vertical columns</li>
                </ul>
              </div>
              <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                <p className="text-sm">
                  <strong>Exercise:</strong> Create a list of words that contain your slowest key combinations.
                  Practice typing this list for 5 minutes daily for a week, and notice how your speed improves for these specific combinations.
                </p>
              </div>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                <BarChart2 className="h-4 w-4 text-primary" />
                Breaking Through Plateaus
              </h3>
              <p className="text-muted-foreground mb-4">
                Most typists experience plateaus where progress seems to stall. These techniques can help you 
                break through these barriers.
              </p>
              <div className="space-y-4 mb-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Overtraining</h4>
                  <p className="text-sm text-muted-foreground">
                    Temporarily practice at a speed 20-30% faster than your current maximum. You'll make more errors,
                    but when you return to your normal speed, it will feel easier and more manageable.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Variable Practice</h4>
                  <p className="text-sm text-muted-foreground">
                    Alternate between different types of content (code, prose, technical text) and different 
                    practice modalities (speed runs, accuracy focus, rhythm practice) rather than doing the same 
                    exercises repeatedly.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Strategic Rest</h4>
                  <p className="text-sm text-muted-foreground">
                    Sometimes a plateau indicates fatigue. Take 1-2 days completely off from typing practice, 
                    then return with fresh fingers and focus.
                  </p>
                </div>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="text-sm italic">
                  <strong>Progress Note:</strong> Speed improvements often come in bursts rather than gradually. 
                  You might practice at 60 WPM for weeks, then suddenly find yourself able to type at 70 WPM. 
                  Trust the process and be patient with plateaus.
                </p>
              </div>
            </section>
            
            <Separator />
            
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Ready to apply these advanced techniques? Return to TypeSpeed Master and start practicing at the next level!
              </p>
              <Button variant="default" size="sm" className="mx-auto" asChild>
                <a href="#/typing-test" className="flex items-center gap-1">
                  Test Your Speed <ArrowRight className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}; 