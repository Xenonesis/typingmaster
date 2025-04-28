import { SignupForm } from "@/components/auth/SignupForm";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";

export default function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <Header />
      <div className="container max-w-screen-xl mx-auto px-4 py-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center min-h-[70vh]"
        >
          <SignupForm />
        </motion.div>
      </div>
    </div>
  );
} 