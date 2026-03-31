import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toPng } from "html-to-image";
import {
  TrendingDown,
  TrendingUp,
  Send,
  CheckCircle2,
  Check,
  Info,
  AlertCircle,
  Camera,
  Percent,
  Search,
  ChevronDown,
  User,
  Building2,
  RotateCcw,
  Globe,
  Filter
} from "lucide-react";
import { cn } from "./lib/utils";

// --- Constants ---
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/26900249/unayl9h/"; // Replace with actual URL

const REPRESENTATIVES = [
  {"name":"Flour, Marius","funnel":"Inbound","country":"France"},
  {"name":"Michaut, Jessica","funnel":"Inbound","country":"France"},
  {"name":"Guedon, Mathieu","funnel":"Inbound","country":"France"},
  {"name":"Krieger, Axel","funnel":"Inbound","country":"France"},
  {"name":"Mbotto, Judicael","funnel":"Inbound","country":"France"},
  {"name":"Feki, Youssef","funnel":"Inbound","country":"France"},
  {"name":"Raimbault, David","funnel":"Inbound","country":"France"},
  {"name":"Devarieux, Wardley","funnel":"Inbound","country":"France"},
  {"name":"Lebeau, Antoine","funnel":"Inbound","country":"France"},
  {"name":"Bauer, Pierre-Ilies","funnel":"Inbound","country":"France"},
  {"name":"Marnaoui, Sirine","funnel":"Inbound","country":"France"},
  {"name":"Koussou, Julien","funnel":"Inbound","country":"France"},
  {"name":"Chader, Amine","funnel":"Inbound","country":"France"},
  {"name":"Rahmani, Michael","funnel":"Inbound","country":"France"},
  {"name":"Sylla, Alhadji","funnel":"Inbound","country":"France"},
  {"name":"Ozdemir-Deleaunait, Selim","funnel":"Inbound","country":"France"},
  {"name":"Vol, Aurélien","funnel":"Outbound","country":"France"},
  {"name":"Demer, Raphaël","funnel":"Outbound","country":"France"},
  {"name":"Lo, Kevin","funnel":"Outbound","country":"France"},
  {"name":"Renard, Romain","funnel":"Outbound","country":"France"},
  {"name":"Laine, Axelle","funnel":"Outbound","country":"France"},
  {"name":"Girardin, Valerian","funnel":"Outbound","country":"France"},
  {"name":"Senoville, Samara","funnel":"Outbound","country":"France"},
  {"name":"Laumonerie, Damien","funnel":"Outbound","country":"France"},
  {"name":"Gomez, Roberto","funnel":"Outbound","country":"France"},
  {"name":"Amraoui, Menel","funnel":"Outbound","country":"France"},
  {"name":"Sancho, Aurelien","funnel":"Outbound","country":"France"},
  {"name":"Dupupet, Antoine","funnel":"Outbound","country":"France"},
  {"name":"Moscovici, Agathe","funnel":"Outbound","country":"France"},
  {"name":"Pierrel, Julien","funnel":"Outbound","country":"France"},
  {"name":"Rocca, Raphael","funnel":"Outbound","country":"France"},
  {"name":"Dufour, Alexis","funnel":"Outbound","country":"France"},
  {"name":"Labelle, Bruno","funnel":"Outbound","country":"France"},
  {"name":"De Francesco, Enzo","funnel":"Outbound","country":"France"},
  {"name":"Lallier, Valentin","funnel":"Outbound","country":"France"},
  {"name":"Lemaire, Quentin","funnel":"Outbound","country":"France"},
  {"name":"Millochau, Pauline","funnel":"Outbound","country":"France"},
  {"name":"Taylor, Cheula","funnel":"Outbound","country":"France"},
  {"name":"Vandenbogaerde, Lukas","funnel":"Inbound","country":"Belgium"},
  {"name":"Van Doorn, Rick","funnel":"Inbound","country":"Netherlands"},
  {"name":"Bernaerd, Jerome","funnel":"Inbound","country":"Belgium"},
  {"name":"Festré, Jonas","funnel":"Inbound","country":"Belgium"},
  {"name":"Sierens, Laurens","funnel":"Inbound","country":"Belgium"},
  {"name":"Andries, Antoine","funnel":"Inbound","country":"Belgium"},
  {"name":"Zahaf, Sofyen","funnel":"Inbound","country":"Belgium"},
  {"name":"Berhitu, Jozef","funnel":"Inbound","country":"Netherlands"},
  {"name":"Van Hooland, Tom","funnel":"Inbound","country":"Belgium"},
  {"name":"Thom De Koning","funnel":"Inbound","country":"Netherlands"},
  {"name":"Elakari, Riad","funnel":"Inbound","country":"Belgium"},
  {"name":"Wagemans, Laura","funnel":"Inbound","country":"Belgium"},
  {"name":"Verstraeten, Chloé","funnel":"Inbound","country":"Belgium"},
  {"name":"Aarts, Daniel","funnel":"Inbound","country":"Netherlands"},
  {"name":"De Troyer, Luk","funnel":"Outbound","country":"Belgium"},
  {"name":"Meije, Tyrel","funnel":"Outbound","country":"Netherlands"},
  {"name":"Luijkx, Jasper","funnel":"Outbound","country":"Netherlands"},
  {"name":"Beers, Enzo","funnel":"Outbound","country":"Netherlands"},
  {"name":"Jacobs, Gijs","funnel":"Outbound","country":"Netherlands"},
  {"name":"Karsten, Karst","funnel":"Outbound","country":"Netherlands"},
  {"name":"Beerman, Crystal","funnel":"Outbound","country":"Netherlands"},
  {"name":"Souirat, Lamiae","funnel":"Outbound","country":"Belgium"},
  {"name":"Verlinde, Piet","funnel":"Outbound","country":"Belgium"},
  {"name":"Alcoba, Jonathan","funnel":"Outbound","country":"Belgium"},
  {"name":"Fenichiu, Estelle","funnel":"Outbound","country":"Belgium"},
  {"name":"Tak, Tristan","funnel":"Outbound","country":"Netherlands"},
  {"name":"Brouns, Michelle","funnel":"Outbound","country":"Belgium"},
  {"name":"Gihousse, Rachelle","funnel":"Outbound","country":"Belgium"},
  {"name":"Doezé, Juliët","funnel":"Outbound","country":"Netherlands"},
  {"name":"Matthee, Tine","funnel":"Outbound","country":"Belgium"},
  {"name":"Yaakoubi, Ouassim","funnel":"Outbound","country":"Belgium"},
  {"name":"Schuermans, Milan","funnel":"Outbound","country":"Belgium"},
  {"name":"Kelepouris, Evi","funnel":"Outbound","country":"Belgium"},
  {"name":"Walschots, Amy","funnel":"Outbound","country":"Benelux"},
  {"name":"OPEN - Field AE Paris 1","funnel":"Outbound","country":"France"},
  {"name":"OPEN - Field AE Paris 2","funnel":"Outbound","country":"France"},
  {"name":"OPEN - Benelux AE Inbound","funnel":"Inbound","country":"Belgium"},
  {"name":"OPEN - Benelux Field AE 1","funnel":"Outbound","country":"Benelux"}
];

// --- Types ---
interface Representative {
  name: string;
  funnel: string;
  country: string;
}

interface DealData {
  representative: Representative | null;
  accountName: string;
  listPrice: number | "";
  salesPrice: number | "";
  softwareMrr: number | "";
  payMrr: number | "";
  justification: string;
}

// --- Components ---
const StatCard = ({ label, value, subValue, color, icon: Icon }: any) => (
  <div className="glass p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden border border-zinc-100 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</span>
      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center", color.replace('bg-', 'bg-').replace('500', '500/10'))}>
        <Icon className={cn("w-3.5 h-3.5", color.replace('bg-', 'text-'))} />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-bold tracking-tight text-zinc-900">{value}</span>
      <span className={cn("text-[10px] font-semibold mt-0.5", color.replace('bg-', 'text-'))}>{subValue}</span>
    </div>
  </div>
);

const RepSelector = ({ selected, onSelect }: { selected: Representative | null, onSelect: (rep: Representative) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = REPRESENTATIVES.filter(rep => 
    rep.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-xs font-bold text-zinc-500 mb-1.5 block uppercase tracking-wider">Sales Representative</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all text-left shadow-sm"
      >
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-zinc-400" />
          <span className={cn("text-sm font-medium", !selected && "text-zinc-400")}>
            {selected ? selected.name : "Select representative..."}
          </span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-zinc-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute z-50 w-full mt-2 bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-3 border-b border-zinc-100 bg-zinc-50/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by name..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {filtered.length > 0 ? (
                filtered.map((rep) => (
                  <button
                    key={rep.name}
                    onClick={() => {
                      onSelect(rep);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className="w-full flex flex-col p-3 rounded-lg hover:bg-zinc-50 transition-colors text-left group"
                  >
                    <span className="text-sm font-semibold text-zinc-900 group-hover:text-black">{rep.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded font-bold uppercase tracking-tighter">{rep.funnel}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded font-bold uppercase tracking-tighter">{rep.country}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-zinc-400">No representatives found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [deal, setDeal] = useState<DealData>({
    representative: null,
    accountName: "",
    listPrice: "",
    salesPrice: "",
    softwareMrr: "",
    payMrr: 120,
    justification: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [showPayMrrInfo, setShowPayMrrInfo] = useState(false);
  const [isScreenshotting, setIsScreenshotting] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);

  const resetCalculator = () => {
    setDeal({
      representative: null,
      accountName: "",
      listPrice: "",
      salesPrice: "",
      softwareMrr: "",
      payMrr: 120,
      justification: ""
    });
  };

  const takeScreenshot = async () => {
    if (!appRef.current) return;
    setIsScreenshotting(true);
    setTimeout(async () => {
      try {
        const dataUrl = await toPng(appRef.current!, {
          backgroundColor: "#FFFFFF",
          quality: 1,
          pixelRatio: 2,
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

  const metrics = useMemo(() => {
    const listPrice = deal.listPrice === "" ? 0 : Number(deal.listPrice);
    const salesPrice = deal.salesPrice === "" ? 0 : Number(deal.salesPrice);
    const softwareMrr = deal.softwareMrr === "" ? 0 : Number(deal.softwareMrr);
    const payMrr = deal.payMrr === "" ? 0 : Number(deal.payMrr);
    const totalMrr = softwareMrr + payMrr;

    const discountPercent = listPrice > 0 ? ((listPrice - salesPrice) / listPrice) * 100 : 0;
    const hardwareCost = listPrice * 0.7;
    const rawPayback = totalMrr > 0 ? Math.max(0, (hardwareCost - salesPrice) / totalMrr) : 0;
    const paybackMonths = Math.ceil(rawPayback);
    const hwLoss = hardwareCost - salesPrice;

    const discountNeedsApproval = discountPercent > 65;
    
    // Funnel-based payback threshold
    const paybackThreshold = deal.representative?.funnel === "Inbound" ? 8 : 12;
    const paybackNeedsDirector = paybackMonths > paybackThreshold;

    let requiredApprover = "None";
    if (discountNeedsApproval) {
      requiredApprover = paybackNeedsDirector ? "Director" : "Manager";
    }

    return {
      discountPercent,
      paybackMonths,
      needsApproval: discountNeedsApproval,
      hardwareCost,
      hwLoss,
      paybackThreshold,
      paybackNeedsDirector,
      requiredApprover
    };
  }, [deal]);

  const handleSubmit = async () => {
    if (metrics.needsApproval && !deal.justification) return;
    if (!deal.representative) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: deal.representative.name,
        funnel: deal.representative.funnel,
        country: deal.representative.country,
        accountName: deal.accountName,
        listPrice: deal.listPrice,
        salesPrice: deal.salesPrice,
        softwareMrr: deal.softwareMrr,
        payMrr: deal.payMrr,
        discount: metrics.discountPercent.toFixed(1) + "%",
        payback: metrics.paybackMonths + " months",
        hwLoss: "€" + metrics.hwLoss.toLocaleString(),
        justification: deal.justification,
        requiredApprover: metrics.requiredApprover,
        timestamp: new Date().toISOString()
      };

      // POST to Zapier
      await fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (err) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPayMrrInvalid = deal.payMrr !== "" && Number(deal.payMrr) < 120;
  const canSubmit = deal.representative && deal.accountName && deal.listPrice !== "" && deal.salesPrice !== "" && !isPayMrrInvalid && (metrics.needsApproval ? deal.justification : true);

  return (
    <div ref={appRef} className={cn("min-h-screen bg-zinc-50 text-zinc-900 flex flex-col lg:flex-row", isScreenshotting && "w-[1200px] h-[800px]")}>
      {/* Sidebar: Inputs */}
      <aside className={cn(
        "w-full lg:w-[420px] bg-white border-r border-zinc-200 p-8 flex flex-col gap-8 overflow-y-auto shrink-0 shadow-sm",
        isScreenshotting && "w-[380px]"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-black/10">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black leading-tight tracking-tight">Lightspeed</h1>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Deal Calculator</p>
            </div>
          </div>
          <button 
            onClick={resetCalculator}
            className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-all"
            title="Reset Calculator"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <RepSelector 
            selected={deal.representative} 
            onSelect={(rep) => setDeal({...deal, representative: rep})} 
          />

          {deal.representative && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-100"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-zinc-200 rounded-full shadow-sm">
                <Filter className="w-3 h-3 text-zinc-400" />
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-600">{deal.representative.funnel}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-zinc-200 rounded-full shadow-sm">
                <Globe className="w-3 h-3 text-zinc-400" />
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-600">{deal.representative.country}</span>
              </div>
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Account Name</label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              className="w-full p-3.5 rounded-xl border border-zinc-200 text-sm focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all bg-zinc-50/30"
              value={deal.accountName}
              onFocus={(e) => e.target.select()}
              onChange={e => setDeal({...deal, accountName: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Software MRR (€)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full p-3.5 rounded-xl border border-zinc-200 text-sm focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all bg-zinc-50/30"
                value={deal.softwareMrr}
                onFocus={(e) => e.target.select()}
                onChange={e => setDeal({...deal, softwareMrr: e.target.value === "" ? "" : Number(e.target.value)})}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pay MRR (€)</label>
                <button onClick={() => setShowPayMrrInfo(!showPayMrrInfo)} className="text-zinc-300 hover:text-zinc-500 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="number"
                placeholder="120"
                className={cn(
                  "w-full p-3.5 rounded-xl border text-sm focus:ring-4 outline-none transition-all bg-zinc-50/30",
                  isPayMrrInvalid ? "border-red-500 focus:ring-red-500/10" : "border-zinc-200 focus:ring-black/5 focus:border-black"
                )}
                value={deal.payMrr}
                onFocus={(e) => e.target.select()}
                onChange={e => setDeal({...deal, payMrr: e.target.value === "" ? "" : Number(e.target.value)})}
              />
              {isPayMrrInvalid && <p className="text-[9px] font-bold text-red-500 uppercase tracking-tighter ml-1">Min 120€ required</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">List Price (€)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full p-3.5 rounded-xl border border-zinc-200 text-sm focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all bg-zinc-50/30"
                value={deal.listPrice}
                onFocus={(e) => e.target.select()}
                onChange={e => setDeal({...deal, listPrice: e.target.value === "" ? "" : Number(e.target.value)})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Sales Price (€)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full p-3.5 rounded-xl border border-zinc-200 text-sm focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all bg-zinc-50/30"
                value={deal.salesPrice}
                onFocus={(e) => e.target.select()}
                onChange={e => setDeal({...deal, salesPrice: e.target.value === "" ? "" : Number(e.target.value)})}
              />
            </div>
          </div>

          <AnimatePresence>
            {showPayMrrInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-zinc-50 p-4 rounded-xl border border-zinc-100"
              >
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                  Estimated minimum Pay MRR per deal is 120 euros. This is a mandatory guardrail for all hardware deals.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-8 border-t border-zinc-100">
          <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.2em] text-center">Lightspeed Internal Tool v2.1</p>
        </div>
      </aside>

      {/* Main Content: Results */}
      <main className={cn(
        "flex-1 p-8 lg:p-12 flex flex-col gap-8 overflow-y-auto",
        isScreenshotting && "p-12"
      )}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Discount %"
            value={`${metrics.discountPercent.toFixed(0)}%`}
            subValue={metrics.needsApproval ? "Requires Approval" : "Auto-Approved"}
            color={metrics.needsApproval ? "bg-red-500" : "bg-emerald-500"}
            icon={Percent}
          />
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
            subValue={metrics.paybackMonths <= metrics.paybackThreshold ? "Within Threshold" : "Exceeds Threshold"}
            color={metrics.paybackMonths <= metrics.paybackThreshold ? "bg-emerald-500" : "bg-red-500"}
            icon={TrendingUp}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {metrics.needsApproval ? (
              <motion.div
                key="approval"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-black/5 flex-1 flex flex-col"
              >
                <div className="flex items-start gap-8 mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Approval Required</h3>
                      <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                        {metrics.requiredApprover} Level
                      </span>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                      This deal exceeds the 65% hardware discount threshold. A mandatory justification is required for {metrics.requiredApprover} review.
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Justification</label>
                    <textarea
                      rows={6}
                      className="w-full p-6 rounded-3xl border-2 border-zinc-100 bg-zinc-50 focus:border-black focus:bg-white transition-all resize-none text-sm font-medium outline-none"
                      placeholder="Explain why this discount is necessary for this account..."
                      value={deal.justification}
                      onChange={e => setDeal({...deal, justification: e.target.value})}
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !canSubmit}
                    className={cn(
                      "w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl",
                      !canSubmit || isSubmitting
                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-zinc-800 active:scale-[0.98] shadow-black/10"
                    )}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : submitStatus === "success" ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Submitted Successfully
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit for {metrics.requiredApprover} Approval
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="auto-approved"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white p-12 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-black/5 flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-24 h-24 rounded-[2rem] bg-emerald-500 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-black text-zinc-900 mb-2 tracking-tight">✅ Auto-Approved</h3>
                <p className="text-zinc-500 max-w-sm mb-10 text-sm leading-relaxed font-medium">
                  This deal is within policy guardrails. No additional management oversight is required for this configuration.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  {!isScreenshotting && (
                    <>
                      <button
                        onClick={takeScreenshot}
                        className="flex-1 py-4 px-8 rounded-2xl bg-zinc-100 text-zinc-900 font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        Save as Image
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !canSubmit}
                        className="flex-1 py-4 px-8 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-black/10"
                      >
                        <Send className="w-4 h-4" />
                        Log Deal
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Footer */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Funnel</span>
              <span className="text-xs font-black text-zinc-900">{deal.representative?.funnel || "N/A"}</span>
            </div>
            <div className="w-px h-6 bg-zinc-200" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Country</span>
              <span className="text-xs font-black text-zinc-900">{deal.representative?.country || "N/A"}</span>
            </div>
            <div className="w-px h-6 bg-zinc-200" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Threshold</span>
              <span className="text-xs font-black text-zinc-900">{metrics.paybackThreshold} months</span>
            </div>
          </div>
          {!isScreenshotting && (
            <div className="flex items-center gap-4">
              <button 
                onClick={takeScreenshot}
                className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-400 hover:text-black hover:border-zinc-400 transition-all shadow-sm"
                title="Take Screenshot"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button 
                onClick={resetCalculator}
                className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
