import SpendInputForm from "@/components/SpendInputForm";
import { Sparkles, BarChart3, TrendingDown } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      {/* Background gradients for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      
      <main className="container mx-auto px-4 py-16 sm:py-24 flex flex-col items-center flex-1 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-secondary text-sm font-medium text-primary mb-2 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>Save up to 40% on AI subscriptions</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            Stop Overpaying for <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              AI Tools.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Startups waste thousands annually on redundant AI subscriptions. 
            Enter your current tech stack below to discover cheaper alternatives, consolidate licenses, and instantly cut costs.
          </p>

          <div className="flex items-center justify-center gap-8 pt-4 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Analyze Spend
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-500" />
              Find Savings
            </div>
          </div>
        </div>

        {/* Spend Input Form Component */}
        <div className="w-full relative flex-1">
          <SpendInputForm />
        </div>

      </main>
    </div>
  );
}
