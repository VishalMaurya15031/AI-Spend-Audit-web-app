"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Sparkles, Code2, PenTool, Plus, Trash2, ArrowRight, Zap } from "lucide-react";
import { AuditReport, generateAuditReport } from "@/lib/audit-engine";
import AuditResults from "./AuditResults";

// Predefined tools
const PREDEFINED_TOOLS = [
  { id: "chatgpt", name: "ChatGPT Plus", defaultPrice: 20, icon: Bot },
  { id: "claude", name: "Claude Pro", defaultPrice: 20, icon: Sparkles },
  { id: "cursor", name: "Cursor Pro", defaultPrice: 20, icon: Code2 },
  { id: "copilot", name: "GitHub Copilot", defaultPrice: 10, icon: Code2 },
  { id: "midjourney", name: "Midjourney", defaultPrice: 30, icon: PenTool },
];

export default function SpendInputForm() {
  const [selectedTools, setSelectedTools] = useState<{id: string, name: string, price: number}[]>([]);
  const [customToolName, setCustomToolName] = useState("");
  const [customToolPrice, setCustomToolPrice] = useState("");
  const [report, setReport] = useState<AuditReport | null>(null);

  const handleAddPredefined = (tool: typeof PREDEFINED_TOOLS[0]) => {
    if (!selectedTools.find(t => t.id === tool.id)) {
      setSelectedTools([...selectedTools, { id: tool.id, name: tool.name, price: tool.defaultPrice }]);
    }
  };

  const handleRemoveTool = (id: string) => {
    setSelectedTools(selectedTools.filter(t => t.id !== id));
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customToolName && customToolPrice && !isNaN(Number(customToolPrice))) {
      setSelectedTools([
        ...selectedTools,
        {
          id: `custom-${Date.now()}`,
          name: customToolName,
          price: Number(customToolPrice)
        }
      ]);
      setCustomToolName("");
      setCustomToolPrice("");
    }
  };

  const handleRunAudit = () => {
    if (selectedTools.length > 0) {
      setReport(generateAuditReport(selectedTools));
    }
  };

  if (report) {
    return <AuditResults report={report} onReset={() => setReport(null)} />;
  }

  const totalSpend = selectedTools.reduce((acc, tool) => acc + tool.price, 0);

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <Card className="w-full max-w-2xl mx-auto border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary fill-primary/20" />
            Audit Your AI Stack
          </CardTitle>
          <CardDescription>
            Select the AI tools you currently pay for, or add custom ones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Add */}
          <div className="space-y-3">
            <Label className="text-muted-foreground uppercase text-xs tracking-wider font-semibold">Quick Add Popular Tools</Label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_TOOLS.map((tool) => {
                const isSelected = selectedTools.some(t => t.id === tool.id);
                const Icon = tool.icon;
                return (
                  <Button
                    key={tool.id}
                    variant={isSelected ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleAddPredefined(tool)}
                    disabled={isSelected}
                    className="rounded-full transition-all duration-300"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tool.name}
                    {!isSelected && <span className="ml-2 opacity-50">${tool.defaultPrice}</span>}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Selected Tools List */}
          <div className="space-y-3">
            <Label className="text-muted-foreground uppercase text-xs tracking-wider font-semibold">Your Current Stack</Label>
            <div className="space-y-2 min-h-[120px] p-4 rounded-xl border border-border/40 bg-black/20 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {selectedTools.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-muted-foreground text-sm py-8 flex flex-col items-center justify-center gap-2"
                  >
                    <Bot className="w-8 h-8 opacity-20 mb-2" />
                    No tools added yet. <br/> Select from above or add a custom tool.
                  </motion.div>
                ) : (
                  selectedTools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-secondary/50 hover:bg-secondary/30 transition-colors"
                    >
                      <span className="font-medium text-sm sm:text-base">{tool.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-muted-foreground">${tool.price}/mo</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-destructive/20 hover:text-destructive" 
                          onClick={() => handleRemoveTool(tool.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Add Custom Tool */}
          <form onSubmit={handleAddCustom} className="flex items-end gap-3 p-4 rounded-xl bg-secondary/10 border border-border/40">
            <div className="flex-1 space-y-2">
              <Label htmlFor="toolName" className="text-xs">Custom Tool Name</Label>
              <Input 
                id="toolName" 
                placeholder="e.g. Jasper AI" 
                value={customToolName}
                onChange={(e) => setCustomToolName(e.target.value)}
                className="bg-background/50 border-border/50"
              />
            </div>
            <div className="w-24 space-y-2">
              <Label htmlFor="toolPrice" className="text-xs">Price ($)</Label>
              <Input 
                id="toolPrice" 
                type="number" 
                placeholder="20" 
                value={customToolPrice}
                onChange={(e) => setCustomToolPrice(e.target.value)}
                className="bg-background/50 border-border/50"
              />
            </div>
            <Button type="submit" variant="secondary" className="mb-px" disabled={!customToolName || !customToolPrice}>
              <Plus className="w-4 h-4" />
            </Button>
          </form>

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/40 bg-secondary/5 rounded-b-xl">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Total Monthly Spend</span>
            <span className="text-4xl font-bold tracking-tight text-foreground flex items-baseline gap-1">
              ${totalSpend}
              <span className="text-base font-normal text-muted-foreground">/mo</span>
            </span>
          </div>
          <Button 
            size="lg" 
            className="w-full sm:w-auto font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group" 
            disabled={selectedTools.length === 0}
            onClick={handleRunAudit}
          >
            Run Audit Engine 
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
