import { Link } from "react-router-dom";
import { Keyboard, Github, Mail, ArrowRight, Instagram, Linkedin, Heart, Globe, MessageSquare, BellRing, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// What's New Component
function WhatsNew() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative group">
          <BellRing className="h-4 w-4 mr-2 text-primary" />
          <span>What's New</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Latest Updates
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            See what's new in TypeSpeed Master
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="border-l-2 border-primary pl-4 py-2 space-y-1">
            <div className="flex items-center">
              <h3 className="text-base font-medium">Improved User Interface</h3>
              <Badge variant="outline" className="ml-2 text-xs">New</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Enhanced visual design with better navigation and accessibility features.</p>
            <p className="text-xs text-muted-foreground">Added: Today</p>
          </div>
          
          <div className="border-l-2 border-accent/70 pl-4 py-2 space-y-1">
            <div className="flex items-center">
              <h3 className="text-base font-medium">Practice Mode</h3>
              <Badge variant="outline" className="ml-2 text-xs">New</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Targeted exercises to improve specific typing skills and muscle memory.</p>
            <p className="text-xs text-muted-foreground">Added: 2 days ago</p>
          </div>
          
          <div className="border-l-2 border-muted-foreground/30 pl-4 py-2 space-y-1">
            <h3 className="text-base font-medium">AI Challenge Mode</h3>
            <p className="text-sm text-muted-foreground">Compete against AI opponents that adapt to your skill level.</p>
            <p className="text-xs text-muted-foreground">Added: 1 week ago</p>
          </div>
          
          <div className="border-l-2 border-muted-foreground/30 pl-4 py-2 space-y-1">
            <h3 className="text-base font-medium">Enhanced Analytics</h3>
            <p className="text-sm text-muted-foreground">More detailed statistics and performance insights in the Stats panel.</p>
            <p className="text-xs text-muted-foreground">Added: 2 weeks ago</p>
          </div>
          
          <Link to="/updates" className="flex items-center text-sm text-primary hover:underline mt-4">
            View all updates
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Privacy Policy Component
function PrivacyPolicy() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:text-primary underline underline-offset-2 transition-colors duration-200">Privacy Policy</button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Privacy Policy</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Our commitment to protecting your privacy
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-medium">TypeSpeed Master Privacy Policy</h3>
          
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <span className="font-medium">Data Collection:</span> We collect typing speed, accuracy, and performance metrics to improve your typing experience.
            </li>
            <li>
              <span className="font-medium">Personal Information:</span> We only collect email addresses for newsletter subscriptions with your explicit consent.
            </li>
            <li>
              <span className="font-medium">Usage Data:</span> Anonymous usage data is collected to enhance our service and identify areas for improvement.
            </li>
            <li>
              <span className="font-medium">Cookies:</span> We use essential cookies to maintain your session and preferences.
            </li>
            <li>
              <span className="font-medium">Third-Party Services:</span> We do not share your data with third parties without your consent.
            </li>
            <li>
              <span className="font-medium">Data Security:</span> We implement security measures to protect your data from unauthorized access.
            </li>
            <li>
              <span className="font-medium">User Rights:</span> You have the right to access, modify, or delete your personal data from our system.
            </li>
            <li>
              <span className="font-medium">Data Retention:</span> Your data is stored only as long as necessary for providing our service.
            </li>
            <li>
              <span className="font-medium">Updates to Policy:</span> We may update this policy periodically and will notify you of significant changes.
            </li>
            <li>
              <span className="font-medium">Contact Information:</span> For privacy concerns, please contact us at itisaddy7@gmail.com.
            </li>
          </ul>
          
          <p className="text-sm text-muted-foreground pt-3">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API request with timeout
    setTimeout(() => {
      // Success state
      toast({
        title: "Subscription successful!",
        description: "You'll now receive typing tips and updates in your inbox.",
      });
      
      setEmail("");
      setIsSubmitting(false);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      }
    }
  };

  return (
    <footer className="border-t border-border/40 bg-gradient-to-b from-background to-card/20 backdrop-blur-sm py-16 mt-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-transparent to-accent/20"></div>
      <div className="absolute -top-10 right-[10%] w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 left-[5%] w-32 h-32 bg-accent/5 rounded-full blur-xl"></div>
      
      <div className="container relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div className="space-y-4 md:col-span-4" variants={itemVariants}>
            <motion.div 
              className="flex items-center gap-2 mb-4"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 rounded-full blur-sm"></div>
                <Keyboard className="h-6 w-6 text-primary relative" />
              </div>
              <span className="font-bold text-xl gradient-heading">TypeSpeed Master</span>
            </motion.div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Improve your typing speed and accuracy with our state-of-the-art typing test platform. 
              Practice regularly to enhance your typing skills and boost productivity.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs border border-border/30">
                <Globe className="h-3.5 w-3.5" />
                <span>10+ Languages</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs border border-border/30">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Community Support</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs border border-border/30">
                <Heart className="h-3.5 w-3.5" />
                <span>Daily Updates</span>
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground pt-4">
              &copy; {new Date().getFullYear()} TypeSpeed Master. All rights reserved.
            </div>
          </motion.div>
          
          <motion.div className="md:col-span-3 md:mx-auto" variants={itemVariants}>
            <h3 className="font-medium text-lg mb-5 flex items-center">
              <span className="w-5 h-0.5 bg-primary/50 mr-2"></span>
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="space-y-3">
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/typing-test">Typing Test</FooterLink>
                <FooterLink to="/stats">Statistics</FooterLink>
                <FooterLink to="/leaderboard">Leaderboard</FooterLink>
              </div>
              <div className="space-y-3">
                <FooterLink to="/profile">Profile</FooterLink>
                <FooterLink to="/achievements">Achievements</FooterLink>
                <FooterLink to="/updates">Updates</FooterLink>
                <FooterLink to="/about">About Us</FooterLink>
              </div>
            </div>
          </motion.div>
          
          <motion.div className="md:col-span-5" variants={itemVariants}>
            <h3 className="font-medium text-lg mb-5 flex items-center">
              <span className="w-5 h-0.5 bg-primary/50 mr-2"></span>
              Connect with us
            </h3>
            <div className="flex space-x-4 mb-8">
              <SocialButton icon={<Instagram className="h-4 w-4" />} label="Instagram" href="https://www.instagram.com/i__aditya7/" />
              <SocialButton icon={<Github className="h-4 w-4" />} label="GitHub" href="https://github.com/Xenonesis" />
              <SocialButton icon={<Linkedin className="h-4 w-4" />} label="LinkedIn" href="https://www.linkedin.com/in/itisaddy/" />
              <SocialButton icon={<Mail className="h-4 w-4" />} label="Email" href="mailto:itisaddy7@gmail.com" />
            </div>
            
            <div className="bg-card/20 backdrop-blur-sm rounded-xl p-5 border border-border/30">
              <h4 className="text-base font-medium mb-3">Subscribe to our newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/80 border-border/60"
                  disabled={isSubmitting}
                />
                <Button 
                  type="submit" 
                  variant="default" 
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="h-4 w-4 border-2 border-t-transparent border-white rounded-full"
                    />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-3">
                Get typing tips and updates right in your inbox. We'll never spam you.
              </p>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-12 pt-6 border-t border-border/20 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-3">
            <WhatsNew />
            <span className="text-border">|</span>
            <PrivacyPolicy />
          </div>
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="h-3.5 w-3.5 text-red-500 animate-pulse" /> for typists everywhere
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ x: 3 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link 
        to={to} 
        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 block"
      >
        {children}
      </Link>
    </motion.div>
  );
}

function SocialButton({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-full bg-background/70 border-border/60 hover:bg-primary/10 hover:text-primary"
          aria-label={label}
        >
          {icon}
        </Button>
      </a>
    </motion.div>
  );
}
