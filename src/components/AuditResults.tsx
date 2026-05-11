"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuditReport } from "@/lib/audit-engine";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingDown, AlertTriangle, CheckCircle2, ArrowRight, Mail, Sparkles, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuditResults({ 
  report, 
  onReset, 
  isShared = false,
  initialSummary = ""
}: { 
  report: AuditReport, 
  onReset?: () => void,
  isShared?: boolean,
  initialSummary?: string
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(initialSummary);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isShared && !aiSummary) {
      fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportData: report })
      })
      .then(res => res.json())
      .then(data => {
        if (data.summary) setAiSummary(data.summary);
      })
      .catch(console.error);
    }
  }, [report, isShared, aiSummary]);

  const handleSaveReport = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reportData: report, aiSummary })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/report/${data.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto space-y-8 pb-12"
    >
      {/* AI Summary Section */}
      {aiSummary && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-primary/10 border border-primary/20 rounded-xl p-4 sm:p-6 flex gap-4 items-start">
          <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div className="space-y-1">
            <h3 className="font-semibold text-primary">AI Executive Summary</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{aiSummary}</p>
          </div>
        </motion.div>
      )}

      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/40 backdrop-blur-xl border-border/50">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase tracking-wider font-semibold text-xs">Current Spend</CardDescription>
            <CardTitle className="text-4xl">${report.currentSpend}<span className="text-lg text-muted-foreground font-normal">/mo</span></CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-primary/10 border-primary/20 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingDown className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardDescription className="uppercase tracking-wider font-semibold text-xs text-primary">Potential Savings</CardDescription>
            <CardTitle className="text-4xl text-primary">${report.monthlySavings}<span className="text-lg opacity-70 font-normal">/mo</span></CardTitle>
            <p className="text-sm font-medium text-primary/80 mt-1">That's ${report.yearlySavings}/year!</p>
          </CardHeader>
        </Card>

        <Card className="bg-card/40 backdrop-blur-xl border-border/50">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase tracking-wider font-semibold text-xs">Optimized Spend</CardDescription>
            <CardTitle className="text-4xl text-green-500">${report.optimizedSpend}<span className="text-lg text-muted-foreground font-normal">/mo</span></CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight px-1">Actionable Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.recommendations.map((rec, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              key={rec.id}
              className="h-full"
            >
              <Card className="h-full border-border/50 bg-card/20 hover:bg-card/40 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      {rec.type === 'cancel' && <AlertTriangle className="w-5 h-5 text-destructive" />}
                      {rec.type === 'downgrade' && <TrendingDown className="w-5 h-5 text-yellow-500" />}
                      {rec.type === 'evaluate' && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                      {rec.title}
                    </CardTitle>
                    <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded text-sm shrink-0">
                      Save ${rec.potentialSavings}/mo
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{rec.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Actions (Lead Capture or Share) */}
      {!isShared ? (
        <Card className="border-primary/20 bg-gradient-to-r from-secondary/20 to-primary/5">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 flex-1">
              <h4 className="text-2xl font-bold">Save this audit report</h4>
              <p className="text-muted-foreground text-sm">Enter your email to generate a shareable URL.</p>
            </div>
            <div className="flex-1 w-full flex items-center gap-2">
              <Input 
                type="email" 
                placeholder="founder@startup.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-background" 
              />
              <Button className="shrink-0" onClick={handleSaveReport} disabled={loading || !email}>
                <Mail className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Report"}
              </Button>
            </div>
          </CardContent>
          {onReset && (
            <CardFooter className="bg-black/10 border-t border-border/50 px-6 py-4 flex justify-start items-center">
              <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
                &larr; Start New Audit
              </Button>
            </CardFooter>
          )}
        </Card>
      ) : (
        <Card className="border-primary/20 bg-gradient-to-r from-secondary/20 to-primary/5">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> This is a saved report
              </h4>
              <p className="text-sm text-muted-foreground">Share this URL with your team to review the audit.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyUrl}>
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy URL"}
              </Button>
              <Button onClick={() => router.push('/')}>Create Your Own Audit</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
