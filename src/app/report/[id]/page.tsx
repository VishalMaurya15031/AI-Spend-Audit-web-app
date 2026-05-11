import { PrismaClient } from "@prisma/client";
import AuditResults from "@/components/AuditResults";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const audit = await prisma.audit.findUnique({
    where: { id },
  });

  if (!audit) {
    return notFound();
  }

  const reportData = JSON.parse(audit.reportData);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden py-16 px-4">
       {/* Background gradients for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight">
          Shared <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">AI Spend Audit</span>
        </h1>
        <AuditResults 
          report={reportData} 
          isShared={true} 
          initialSummary={audit.aiSummary || ""} 
        />
      </div>
    </div>
  );
}
