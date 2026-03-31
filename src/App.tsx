import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import {
  TrendingDown,
  TrendingUp,
  Send,
  CheckCircle2,
  Check,
  Info,
  AlertCircle,
  Camera
} from "lucide-react";
import { cn } from "./lib/utils";

// --- Types ---
interface DealData {
  accountName: string;
  listPrice: number;
  salesPrice: number;
  softwareMrr: number;
  payMrr: number;
  justification: string;
}

// --- Components ---
const StatCard = ({ label, value, subValue, color, icon: Icon }: any) => (
  <div className="glass p-8 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{label}</span>
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", color.replace('bg-', 'bg-').replace('500', '500/10'))}>
        <Icon className={cn("w-4 h-4", color.replace('bg-', 'text-'))} />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-3xl font-bold tracking-tight">{value}</span>
      <span className={cn("text-xs font-medium mt-1", color.replace('bg-', 'text-'))}>{subValue}</span>
    </div>
  </div>
);

export default function App() {
  const [deal, setDeal] = useState<DealData>({
    accountName: "",
    listPrice: 0,
    salesPrice: 0,
    softwareMrr: 0,
    payMrr: 120,
    justification: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [showListPriceInfo, setShowListPriceInfo] = useState(false);
  const [showSalesPriceInfo, setShowSalesPriceInfo] = useState(false);
  const [showPayMrrInfo, setShowPayMrrInfo] = useState(false);
  const [isScreenshotting, setIsScreenshotting] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);

  const takeScreenshot = async () => {
    if (!appRef.current) return;
    
    setIsScreenshotting(true);
    
    // Small delay to allow layout shifts if any
    setTimeout(async () => {
      try {
        const dataUrl = await toPng(appRef.current!, {
          backgroundColor: "#FFFFFF",
          quality: 1,
          pixelRatio: 2,
          // Force a specific width for the screenshot to ensure desktop layout
          width: 1200,
        });
        
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `deal-approval-${deal.accountName || "unnamed"}.png`;
        link.click();
      } catch (error) {
        console.error("Screenshot failed:", error);
      } finally {
        setIsScreenshotting(false);
      }
    }, 150);
  };

  // --- Logic ---
  const metrics = useMemo(() => {
    const listPrice = deal.listPrice || 0;
    const salesPrice = deal.salesPrice || 0;
    const totalMrr = (deal.softwareMrr || 0) + (deal.payMrr || 0);

    // Discount % = (List - Sales) / List
    const discountPercent = listPrice > 0 ? ((listPrice - salesPrice) / listPrice) * 100 : 0;
    
    // Cost = List * 0.7 (30% margin)
    const hardwareCost = listPrice * 0.7;
    
    // Payback = (Cost - Sales) / Total MRR
    const rawPayback = totalMrr > 0 ? Math.max(0, (hardwareCost - salesPrice) / totalMrr) : 0;
    const paybackMonths = Math.ceil(rawPayback);

    const hwLoss = hardwareCost - salesPrice;
    const needsApproval = discountPercent > 65;

    return {
      discountPercent,
      paybackMonths,
      needsApproval,
      hardwareCost,
      hwLoss
    };
  }, [deal]);

  const handleSubmit = async () => {
    if (metrics.needsApproval && !deal.justification) {
      alert("Please provide a justification for this discount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...deal,
          discount: metrics.discountPercent,
          payback: metrics.paybackMonths
        })
      });
      
      if (response.ok) {
        setSubmitStatus("success");
        setTimeout(() => setSubmitStatus("idle"), 3000);
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={appRef} className={cn("min-h-screen bg-white text-zinc-900", isScreenshotting && "w-[1200px]")}>
      {/* Main Content */}
      <main className={cn(
        "p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full transition-all duration-300",
        isScreenshotting && "p-16 w-[1200px] max-w-none"
      )}>
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Deal Approval Calculator</h1>
        </header>

        <div className={cn(
          "grid gap-8",
          isScreenshotting ? "grid-cols-12" : "grid-cols-1 lg:grid-cols-12"
        )}>
          {/* Left Column: Inputs */}
          <div className={cn(
            "flex flex-col gap-6",
            isScreenshotting ? "col-span-4" : "lg:col-span-4"
          )}>
            <section className="glass p-8 rounded-3xl flex flex-col gap-6">
              <h2 className="text-lg font-bold">Deal Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label>Account Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    className="w-full"
                    value={deal.accountName}
                    onChange={e => setDeal({...deal, accountName: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Software MRR (€)</label>
                    <input
                      type="number"
                      className="w-full"
                      value={deal.softwareMrr}
                      onChange={e => setDeal({...deal, softwareMrr: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="mb-0">Pay MRR (€)</label>
                      <button
                        type="button"
                        onClick={() => setShowPayMrrInfo(!showPayMrrInfo)}
                        className="text-zinc-400 hover:text-blue-500 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {showPayMrrInfo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-[10px] text-blue-400 mb-2 leading-tight font-medium"
                      >
                        Estimated minimum Pay MRR per deal = 120 euros
                      </motion.div>
                    )}
                    <input
                      type="number"
                      className="w-full"
                      value={deal.payMrr}
                      onChange={e => {
                        const val = Number(e.target.value);
                        // Block any input lower than 120
                        setDeal({...deal, payMrr: val < 120 ? 120 : val});
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="mb-0">List Price (€)</label>
                      <button
                        type="button"
                        onClick={() => setShowListPriceInfo(!showListPriceInfo)}
                        className="text-zinc-400 hover:text-blue-500 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {showListPriceInfo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-[10px] text-blue-400 mb-2 leading-tight font-medium"
                      >
                        Total price of hardware sold before discount
                      </motion.div>
                    )}
                    <input
                      type="number"
                      className="w-full"
                      value={deal.listPrice}
                      onChange={e => setDeal({...deal, listPrice: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="mb-0">Sales Price (€)</label>
                      <button
                        type="button"
                        onClick={() => setShowSalesPriceInfo(!showSalesPriceInfo)}
                        className="text-zinc-400 hover:text-blue-500 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {showSalesPriceInfo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-[10px] text-blue-400 mb-2 leading-tight font-medium"
                      >
                        Total price of hardware sold with discount
                      </motion.div>
                    )}
                    <input
                      type="number"
                      className="w-full"
                      value={deal.salesPrice}
                      onChange={e => setDeal({...deal, salesPrice: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Metrics & Approval */}
          <div className={cn(
            "flex flex-col gap-8",
            isScreenshotting ? "col-span-8" : "lg:col-span-8"
          )}>
            <div className={cn(
              "grid gap-6",
              isScreenshotting ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2"
            )}>
              <StatCard
                label="Total HW Loss"
                value={`€${metrics.hwLoss.toLocaleString()}`}
                subValue={metrics.hwLoss > 0 ? "Hardware acquisition cost" : "Hardware profit"}
                color={metrics.hwLoss > 0 ? "bg-red-500" : "bg-emerald-500"}
                icon={TrendingDown}
              />
              <StatCard
                label="CAC Payback"
                value={`${metrics.paybackMonths} mo`}
                subValue={metrics.paybackMonths <= 2 ? "Excellent ROI" : metrics.paybackMonths < 5 ? "Acceptable ROI" : "Poor ROI"}
                color={metrics.paybackMonths <= 2 ? "bg-emerald-500" : metrics.paybackMonths < 5 ? "bg-amber-500" : "bg-red-500"}
                icon={TrendingUp}
              />
            </div>

            {/* Approval Workflow */}
            <AnimatePresence mode="wait">
              {metrics.needsApproval ? (
                <motion.div
                  key="approval"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass p-8 rounded-[2rem] border-red-500/20 bg-red-500/10"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">Manager Approval Required</h3>
                      <div className="text-3xl font-black text-red-500 mb-4">
                        {metrics.discountPercent.toFixed(0)}% Discount
                      </div>
                      <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                        This deal exceeds the 65% hardware discount threshold. To proceed, please provide a justification for the sales manager to review via Slack.
                      </p>
                      
                      <div className="space-y-4">
                        <label>Justification</label>
                        <textarea
                          rows={4}
                          className="w-full resize-none"
                          placeholder="e.g. Strategic account with high expansion potential..."
                          value={deal.justification}
                          onChange={e => setDeal({...deal, justification: e.target.value})}
                        />
                        
                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting || !deal.justification}
                          className={cn(
                            "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
                            isSubmitting || !deal.justification
                              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                              : "bg-black text-white hover:bg-zinc-800 active:scale-[0.98]"
                          )}
                        >
                          {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          ) : submitStatus === "success" ? (
                            <>
                              <CheckCircle2 className="w-5 h-5" />
                              Submitted to Slack
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Submit for Approval
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="auto-approved"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass p-12 rounded-[2rem] border-emerald-500/20 bg-emerald-500/10 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">Deal Auto-Approved</h3>
                  <div className="text-5xl font-black text-emerald-500 mb-4">
                    {metrics.discountPercent.toFixed(0)}%
                  </div>
                  <p className="text-zinc-500 max-w-sm mb-8">
                    Great work! This deal is within policy guardrails and does not require additional management oversight.
                  </p>
                  {!isScreenshotting && (
                    <button
                      onClick={takeScreenshot}
                      className="px-8 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all flex items-center gap-2 active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      Take a screenshot
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
