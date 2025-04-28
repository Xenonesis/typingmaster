import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingActionButton } from "./floating-action-button";
import { Plus } from "lucide-react";

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  showLabels?: boolean;
}

export function QuickActions({
  actions,
  className,
  position = "bottom-right",
  showLabels = true,
}: QuickActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  if (!actions.length) return null;
  
  return (
    <FloatingActionButton
      icon={<Plus className="h-5 w-5" />}
      label="Quick actions"
      onClick={() => {}}
      position={position}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      className={className}
    >
      <div className="flex flex-col gap-2">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant={action.variant || "ghost"}
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
            >
              {action.icon}
              {showLabels && <span>{action.label}</span>}
            </Button>
          </motion.div>
        ))}
      </div>
    </FloatingActionButton>
  );
}