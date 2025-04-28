import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TypingTest as TypingTestComponent } from "@/components/TypingTest";
import { ThemeProvider } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { Keyboard, ArrowDown } from "lucide-react";

const TypingTest = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  
  // Handle scrolling detection
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsAtTop(false);
    } else {
      setIsAtTop(true);
    }
  };
  
  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
        <Header />
        
        <div className="flex-grow container mx-auto px-4 py-6 md:py-8">
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center mb-8"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full text-sm text-primary font-medium shadow-sm mb-4">
                <Keyboard className="h-4 w-4" />
                <span>Test Your Typing Speed</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Master Your <span className="gradient-heading">Typing Skills</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Challenge yourself with our typing test and see how fast and accurate you can type.
                Track your progress and improve your typing speed.
              </p>
            </motion.div>

            {isAtTop && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex justify-center mb-8"
              >
                <div className="animate-bounce p-2 bg-primary/10 rounded-full">
                  <ArrowDown className="h-6 w-6 text-primary" />
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="max-w-5xl mx-auto mb-12">
            <TypingTestComponent />
          </div>
        </div>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default TypingTest; 