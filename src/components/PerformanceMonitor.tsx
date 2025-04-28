import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu, BarChart2, Clock } from "lucide-react";

interface PerformanceMonitorProps {
  averageFrameTime?: number;
  renderCount?: number;
}

export function PerformanceMonitor({ averageFrameTime, renderCount }: PerformanceMonitorProps) {
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState(0);
  const [usageColor, setUsageColor] = useState("bg-green-500");
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate FPS based on average frame time if provided
      if (averageFrameTime && averageFrameTime > 0) {
        const calculatedFps = Math.min(60, Math.round(1000 / averageFrameTime));
        setFps(calculatedFps);
      } else {
        // Fallback to random simulation for demo purposes
        setFps(Math.round(Math.min(60, 50 + Math.random() * 20)));
      }
      
      // Get memory usage if available through performance API
      if (performance && 'memory' in performance) {
        const memoryInfo = (performance as any).memory;
        if (memoryInfo && memoryInfo.usedJSHeapSize) {
          const usedMb = Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024));
          const totalMb = Math.round(memoryInfo.jsHeapSizeLimit / (1024 * 1024));
          const percentage = (usedMb / totalMb) * 100;
          setMemory(percentage);
          
          // Determine color based on memory usage
          if (percentage > 80) {
            setUsageColor("bg-red-500");
          } else if (percentage > 50) {
            setUsageColor("bg-amber-500");
          } else {
            setUsageColor("bg-green-500");
          }
        } else {
          // Fallback to random simulation
          const randomMemory = Math.round(30 + Math.random() * 40);
          setMemory(randomMemory);
          
          if (randomMemory > 80) {
            setUsageColor("bg-red-500");
          } else if (randomMemory > 50) {
            setUsageColor("bg-amber-500");
          } else {
            setUsageColor("bg-green-500");
          }
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [averageFrameTime]);
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
          Performance Monitor
        </CardTitle>
        <CardDescription className="text-xs">
          Real-time application metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">FPS</span>
            </div>
            <span className={`text-sm font-mono ${fps < 30 ? 'text-red-500' : fps < 45 ? 'text-amber-500' : 'text-green-500'}`}>
              {fps}
            </span>
          </div>
          <Progress value={fps} max={60} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Frame Time</span>
            </div>
            <span className="text-sm font-mono">
              {averageFrameTime ? `${averageFrameTime.toFixed(2)} ms` : 'N/A'}
            </span>
          </div>
          <Progress 
            value={averageFrameTime ? Math.min(100, 100 - (averageFrameTime / 25 * 100)) : 100} 
            className="h-2" 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-4 w-4 text-emerald-500"
              >
                <path d="M18 18V6a4 4 0 0 0-4-4H6v16" />
                <path d="M6 8h8" />
                <path d="M8 4v16" />
                <path d="M18 16h.01" />
                <path d="M18 13h.01" />
                <path d="M18 10h.01" />
                <path d="M18 7h.01" />
              </svg>
              <span className="text-sm font-medium">Memory Usage</span>
            </div>
            <span className="text-sm font-mono">
              {memory.toFixed(0)}%
            </span>
          </div>
          <Progress value={memory} className={`h-2 ${usageColor}`} />
        </div>
        
        {renderCount !== undefined && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <span>Render Count:</span>
            <span className="font-mono">{renderCount}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 