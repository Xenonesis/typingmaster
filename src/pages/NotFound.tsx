import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
      <Header />
        
        <div className="flex-grow flex items-center justify-center p-6">
          <motion.div 
            className="text-center max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <Search className="h-24 w-24 text-muted-foreground/20" />
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-primary"
                  animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  ?
                </motion.div>
              </div>
            </motion.div>
            
            <h1 className="text-4xl font-bold mb-3 gradient-heading">404</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Oops! This page seems to have disappeared into the void.
            </p>
            <p className="text-muted-foreground mb-8">
              The page at <span className="font-mono bg-secondary/40 px-2 py-1 rounded text-sm">{location.pathname}</span> doesn't exist.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="default" size="lg" className="gap-2">
                <Link to="/">
                  <Home className="h-4 w-4" />
                  Return Home
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </div>
          </motion.div>
        </div>
        
      <Footer />
    </div>
  );
};

export default NotFound;
