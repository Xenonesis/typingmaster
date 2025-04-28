import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Keyboard, Hand, ThumbsUp, Brain, ArrowRight } from "lucide-react";

export const TypingFundamentals = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Read Guide</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5 text-primary" />
            Typing Fundamentals: Master the Basics
          </DialogTitle>
          <DialogDescription>
            Learn proper hand positioning and ergonomic typing techniques to build a solid foundation.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />
        <ScrollArea className="h-[calc(80vh-120px)] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                <Keyboard className="h-4 w-4 text-primary" />
                Proper Hand Positioning
              </h3>
              <p className="text-muted-foreground mb-4">
                The foundation of fast and accurate typing starts with proper hand positioning on the keyboard.
                Following these guidelines will help you develop muscle memory and reduce strain.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Home Row Position</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Left hand fingers on A, S, D, F</li>
                    <li>Right hand fingers on J, K, L, ;</li>
                    <li>Both thumbs rest on the space bar</li>
                    <li>Index fingers should have tactile bumps (F and J)</li>
                  </ul>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Finger Assignments</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Each finger is responsible for specific keys</li>
                    <li>Left pinky: Q, A, Z and modifiers</li>
                    <li>Right pinky: P, ;, /, modifiers</li>
                    <li>Thumbs handle the space bar</li>
                  </ul>
                </div>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="text-sm italic">
                  <strong>Pro Tip:</strong> When typing, try to keep your fingers curved and hovering over the home row.
                  This allows for quick, efficient movement to other keys while maintaining a reference position.
                </p>
              </div>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                <Hand className="h-4 w-4 text-primary" />
                Ergonomic Considerations
              </h3>
              <p className="text-muted-foreground mb-4">
                Proper ergonomics are crucial for preventing strain and injury during long typing sessions.
                Make these adjustments to your setup for optimal comfort and efficiency.
              </p>
              <div className="space-y-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Posture</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Sit with your back straight and shoulders relaxed</li>
                    <li>Keep your elbows at a 90-degree angle</li>
                    <li>Feet flat on the floor</li>
                    <li>Screen at eye level, about arm's length away</li>
                  </ul>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Wrist Position</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Wrists should hover just above the keyboard, not resting on a surface</li>
                    <li>If using a wrist rest, it should support the palm, not the wrist</li>
                    <li>Avoid bending wrists to the sides</li>
                    <li>Keep wrists straight, not angled up or down</li>
                  </ul>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Keyboard Setup</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Keyboard should be at a height where your elbows can maintain 90 degrees</li>
                    <li>Consider a split or ergonomic keyboard for long-term typing</li>
                    <li>Adjust keyboard tilt to maintain neutral wrist position</li>
                    <li>Position the keyboard directly in front of you</li>
                  </ul>
                </div>
              </div>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                <ThumbsUp className="h-4 w-4 text-primary" />
                Typing Technique
              </h3>
              <p className="text-muted-foreground mb-4">
                Developing proper typing technique early on will help you avoid bad habits that are difficult to correct later.
                Focus on these fundamentals for efficient typing.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Key Strikes</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Use quick, decisive keystrokes</li>
                    <li>Strike keys with the pads of your fingers, not fingernails</li>
                    <li>Apply consistent pressure to all keys</li>
                    <li>Release each key immediately after pressing</li>
                  </ul>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Movement Economy</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Minimize hand movement when typing</li>
                    <li>Keep fingers close to their home positions</li>
                    <li>Let fingers reach for keys rather than moving hands</li>
                    <li>Return fingers to home row after reaching</li>
                  </ul>
                </div>
              </div>
              <div className="bg-accent/5 p-4 rounded-lg border border-accent/20 mb-4">
                <p className="text-sm">
                  <strong>Exercise:</strong> Practice typing the alphabet while focusing on keeping your fingers on the home row.
                  Pay attention to which finger reaches for each key.
                </p>
              </div>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-primary" />
                Developing Muscle Memory
              </h3>
              <p className="text-muted-foreground mb-4">
                Touch typing relies heavily on muscle memory. Consistent practice with proper technique is key to improving your typing speed and accuracy.
              </p>
              <div className="space-y-4 mb-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Practice Routine</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Practice for 15-30 minutes daily rather than hours occasionally</li>
                    <li>Focus on accuracy before speed</li>
                    <li>Use typing tests to track progress</li>
                    <li>Gradually increase difficulty as you improve</li>
                  </ul>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-2">Skill Building</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Practice common letter combinations and words</li>
                    <li>Work on problem keys separately</li>
                    <li>Practice without looking at your hands</li>
                    <li>Type real content like emails or documents for applied practice</li>
                  </ul>
                </div>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="text-sm italic">
                  <strong>Remember:</strong> Typing is a skill that improves with consistent practice. 
                  It's better to practice correctly for a few minutes each day than to practice with poor technique for hours.
                </p>
              </div>
            </section>
            
            <Separator />
            
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Ready to put these fundamentals into practice? Return to TypeSpeed Master and start a typing test!
              </p>
              <Button variant="default" size="sm" className="mx-auto" asChild>
                <a href="#/typing-test" className="flex items-center gap-1">
                  Start Practicing <ArrowRight className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}; 