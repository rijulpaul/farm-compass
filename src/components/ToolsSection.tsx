import { useMemo, useRef, useState, useEffect } from "react";
import { Sprout, BarChart3, MessageCircle, MapPin, Wand2, Send, Leaf, Bot, User, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import {
  CROPS,
  type Season,
  type SoilInputs,
  type Recommendation,
  type YieldReport,
  type ChatMsg,
  recommendCrops,
  predictYield,
  assistantReply,
} from "@/lib/farming";
import { apiRecommend, apiYield } from "@/lib/api";

// Map an arbitrary backend crop name string to one of our local CROP entries
// (so we can show emoji, sowing info, and "why this crop" reasons).
function findCropByName(name: string) {
  const n = name.toLowerCase().trim();
  return (
    CROPS.find((c) => c.name.toLowerCase() === n) ||
    CROPS.find((c) => c.id.toLowerCase() === n) ||
    CROPS.find((c) => c.name.toLowerCase().includes(n) || n.includes(c.id.toLowerCase()))
  );
}

type Tool = "recommend" | "yield" | "chat";

const tools: { id: Tool; label: string; icon: typeof Sprout; sub: string }[] = [
  { id: "recommend", label: "Crop Recommendation", icon: Sprout, sub: "Top 3 crops for your land" },
  { id: "yield", label: "Yield Prediction", icon: BarChart3, sub: "Tonnes you can expect" },
  { id: "chat", label: "AI Assistant", icon: MessageCircle, sub: "Ask anything farming" },
];

export default function ToolsSection() {
  const [active, setActive] = useState<Tool>("recommend");
  const [sharedCrop, setSharedCrop] = useState<string>("rice");
  const [location, setLocation] = useState<string>("Nashik, Maharashtra");

  return (
    <section id="tools" className="py-20 md:py-32 bg-secondary/40 relative overflow-hidden">
      <div className="absolute inset-0 grain-texture opacity-30 pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Try it now</p>
          <h2 className="font-display text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
            Three tools, one tap away.
          </h2>
          <p className="mt-4 text-muted-foreground">
            All running live — no signup needed. Switch between tools below.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-wrap justify-center gap-1.5 p-1.5 bg-card rounded-2xl border border-border/60 shadow-soft">
            {tools.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl text-sm font-semibold transition-smooth ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active panel */}
        <div className="bg-card rounded-3xl border border-border/60 shadow-card overflow-hidden animate-fade-up" key={active}>
          {active === "recommend" && (
            <RecommendPanel
              location={location}
              setLocation={setLocation}
              onPickCrop={(id) => { setSharedCrop(id); setActive("yield"); }}
            />
          )}
          {active === "yield" && (
            <YieldPanel cropId={sharedCrop} setCropId={setSharedCrop} onAsk={() => setActive("chat")} />
          )}
          {active === "chat" && <ChatPanel cropId={sharedCrop} location={location} />}
        </div>
      </div>
    </section>
  );
}

/* ───────── Crop Recommendation ───────── */

function RecommendPanel({
  location,
  setLocation,
  onPickCrop,
}: {
  location: string;
  setLocation: (v: string) => void;
  onPickCrop: (id: string) => void;
}) {
  const [season, setSeason] = useState<Season>("kharif");
  const [n, setN] = useState(80);
  const [p, setP] = useState(50);
  const [k, setK] = useState(50);
  const [ph, setPh] = useState(6.5);
  const [temp, setTemp] = useState(27);
  const [humidity, setHumidity] = useState(65);
  const [rainfall, setRainfall] = useState(900);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const useLocation = () => {
    if (!navigator.geolocation) {
      setLocation("Nashik, Maharashtra");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(`Lat ${pos.coords.latitude.toFixed(2)}, Lng ${pos.coords.longitude.toFixed(2)}`),
      () => setLocation("Nashik, Maharashtra"),
    );
  };

  const submit = async () => {
    setLoading(true);
    setErrorMsg(null);
    setUsingFallback(false);
    const input: SoilInputs = { n, p, k, ph, temp, rainfall, season };
    try {
      const data = await apiRecommend({
        N: n, P: p, K: k,
        temperature: temp,
        humidity,
        ph,
        rainfall,
      });
      const list = (data.crops || []).slice(0, 3);
      const recs: Recommendation[] = list.map((name, i) => {
        const matched = findCropByName(name);
        const crop = matched ?? {
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          emoji: "🌱",
          seasons: [season],
          n: [n, n], p: [p, p], k: [k, k],
          ph: [ph, ph], temp: [temp, temp], rainfall: [rainfall, rainfall],
          yieldPerHa: [0, 0], fertilizerKgPerHa: [0, 0], pesticideLPerHa: [0, 0],
          whyShort: data.message || "Recommended by the model based on your inputs.",
          sowingMonths: "—",
        };
        return {
          crop,
          score: Math.max(60, 95 - i * 12),
          reasons: [
            matched?.whyShort ?? `Model picked ${name} for your conditions.`,
            data.message ? data.message : `Ranked #${i + 1} of ${list.length} by the recommendation model.`,
            matched ? `Best sown: ${matched.sowingMonths}.` : "Check local sowing calendar before planting.",
          ],
        };
      });
      setResults(recs);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(`Couldn't reach the backend (${msg}). Showing offline recommendations instead.`);
      setUsingFallback(true);
      setResults(recommendCrops(input));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-0">
      {/* Inputs */}
      <div className="lg:col-span-2 p-6 sm:p-8 lg:border-r border-border/60">
        <h3 className="font-display text-2xl font-semibold mb-1">Tell us your land</h3>
        <p className="text-sm text-muted-foreground mb-6">Use sliders — no need to type numbers.</p>

        <div className="space-y-5">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</Label>
            <div className="flex gap-2 mt-1.5">
              <Input value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-xl bg-background" />
              <Button type="button" onClick={useLocation} variant="outline" className="rounded-xl shrink-0" aria-label="Use my location">
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Season</Label>
            <div className="grid grid-cols-3 gap-1.5 mt-1.5 p-1 bg-secondary rounded-xl">
              {(["kharif", "rabi", "zaid"] as Season[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`py-2 rounded-lg text-xs font-semibold capitalize transition-smooth ${
                    season === s ? "bg-card shadow-soft text-primary" : "text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <SliderRow label="Nitrogen (N)" value={n} setValue={setN} min={0} max={200} unit="kg/ha" />
          <SliderRow label="Phosphorus (P)" value={p} setValue={setP} min={0} max={150} unit="kg/ha" />
          <SliderRow label="Potassium (K)" value={k} setValue={setK} min={0} max={150} unit="kg/ha" />
          <SliderRow label="Soil pH" value={ph} setValue={setPh} min={3} max={10} step={0.1} unit="" />
          <SliderRow label="Temperature" value={temp} setValue={setTemp} min={5} max={45} unit="°C" />
          <SliderRow label="Humidity" value={humidity} setValue={setHumidity} min={10} max={100} unit="%" />
          <SliderRow label="Rainfall" value={rainfall} setValue={setRainfall} min={100} max={2500} step={10} unit="mm" />

          <Button onClick={submit} disabled={loading} className="w-full rounded-xl h-12 bg-primary hover:bg-primary/90 mt-2">
            <Wand2 className="w-4 h-4" />
            {loading ? "Analysing..." : "Recommend crops"}
          </Button>
        </div>
      </div>

      {/* Output */}
      <div className="lg:col-span-3 p-6 sm:p-8 bg-hero relative">
        <div className="absolute inset-0 bg-sun opacity-50 pointer-events-none" />
        <div className="relative">
          {!results && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center py-16">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-5 animate-float-slow">
                <Sprout className="w-10 h-10 text-primary" />
              </div>
              <h4 className="font-display text-2xl font-semibold mb-2">Your top 3 crops will appear here</h4>
              <p className="text-sm text-muted-foreground max-w-xs">
                Adjust the sliders and tap <span className="font-semibold text-primary">Recommend crops</span> — we'll match them against agronomy rules.
              </p>
            </div>
          )}

          {results && (
            <div>
              {errorMsg && (
                <div className="mb-4 flex items-start gap-2 rounded-xl border border-accent/40 bg-accent/10 p-3 text-xs text-foreground">
                  <AlertTriangle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    Top 3 for {season} {usingFallback ? "· offline" : "· live"}
                  </p>
                  <h4 className="font-display text-2xl font-semibold">Best crops for your field</h4>
                </div>
              </div>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <RecommendationCard key={r.crop.id} rec={r} rank={i + 1} onPickCrop={onPickCrop} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label, value, setValue, min, max, step = 1, unit,
}: { label: string; value: number; setValue: (v: number) => void; min: number; max: number; step?: number; unit: string }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
        <span className="font-display text-sm font-semibold text-primary tabular-nums">
          {value}{unit && <span className="text-muted-foreground font-normal ml-0.5">{unit}</span>}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => setValue(v[0])} />
    </div>
  );
}

function RecommendationCard({ rec, rank, onPickCrop }: { rec: Recommendation; rank: number; onPickCrop: (id: string) => void }) {
  const [open, setOpen] = useState(rank === 1);
  return (
    <article className="bg-card rounded-2xl border border-border/60 p-4 shadow-soft transition-smooth hover:shadow-card">
      <div className="flex items-center gap-4">
        <div className="text-3xl">{rec.crop.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h5 className="font-display text-lg font-semibold truncate">
              <span className="text-muted-foreground text-sm font-normal mr-1">#{rank}</span>{rec.crop.name}
            </h5>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${
              rec.score >= 80 ? "bg-accent text-accent-foreground" : rec.score >= 60 ? "bg-primary-glow/40 text-primary" : "bg-secondary text-muted-foreground"
            }`}>{rec.score}%</span>
          </div>
          <div className="mt-1.5 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-smooth" style={{ width: `${rec.score}%` }} />
          </div>
          <div className="mt-1.5 text-xs text-muted-foreground">
            Yield: <span className="font-semibold text-foreground">{rec.crop.yieldPerHa[0]}–{rec.crop.yieldPerHa[1]} t/ha</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={() => setOpen((v) => !v)} className="text-xs font-semibold text-primary hover:underline">
          {open ? "Hide" : "Why this crop?"}
        </button>
        <span className="text-muted-foreground text-xs">·</span>
        <button onClick={() => onPickCrop(rec.crop.id)} className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
          Predict yield <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      {open && (
        <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground border-t border-border/60 pt-3">
          {rec.reasons.map((r, i) => (
            <li key={i} className="flex gap-2"><Leaf className="w-3 h-3 text-primary mt-0.5 shrink-0" /><span>{r}</span></li>
          ))}
        </ul>
      )}
    </article>
  );
}

/* ───────── Yield Prediction ───────── */

function YieldPanel({ cropId, setCropId, onAsk }: { cropId: string; setCropId: (v: string) => void; onAsk: () => void }) {
  const [area, setArea] = useState(5);
  const [tempRange, setTempRange] = useState(27);
  const [report, setReport] = useState<YieldReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const crop = CROPS.find((c) => c.id === cropId)!;

  const localReport = useMemo<YieldReport>(() => {
    const mid = (crop.temp[0] + crop.temp[1]) / 2;
    const factor = Math.max(0.7, 1 - Math.abs(tempRange - mid) / 30);
    return predictYield(cropId, area, factor);
  }, [cropId, area, tempRange, crop]);

  const fetchYield = async () => {
    setLoading(true);
    setErrorMsg(null);
    setUsingFallback(false);
    try {
      const data = await apiYield({
        crop: crop.name,
        area_ha: area,
        temperature: tempRange,
        method: "iqr",
        narrow_pct: 0.12,
      });
      const num = (v: number | null, fb: number) => (v == null ? fb : +v.toFixed(2));
      const yLo = num(data.yield_per_ha_range?.[0], localReport.perHa[0]);
      const yHi = num(data.yield_per_ha_range?.[1], localReport.perHa[1]);
      const tLo = num(data.total_yield_range?.[0], localReport.total[0]);
      const tHi = num(data.total_yield_range?.[1], localReport.total[1]);
      const fLo = num(data.total_fertilizer_range?.[0], localReport.fertilizer[0]);
      const fHi = num(data.total_fertilizer_range?.[1], localReport.fertilizer[1]);
      const pLo = num(data.total_pesticide_range?.[0], localReport.pesticide[0]);
      const pHi = num(data.total_pesticide_range?.[1], localReport.pesticide[1]);
      setReport({
        perHa: [yLo, yHi],
        total: [tLo, tHi],
        fertilizer: [Math.round(fLo), Math.round(fHi)],
        pesticide: [pLo, pHi],
        summary:
          data.message ||
          `For ${area} ha of ${crop.name}, expect roughly ${yLo}–${yHi} tonnes per hectare — total about ${tLo}–${tHi} tonnes.`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(`Couldn't reach the backend (${msg}). Showing offline estimate instead.`);
      setUsingFallback(true);
      setReport(localReport);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on input change (debounced)
  useEffect(() => {
    const t = setTimeout(fetchYield, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropId, area, tempRange]);

  const shown = report ?? localReport;

  const chartData = [
    { name: "Low", value: shown.total[0], fill: "hsl(var(--primary-glow))" },
    { name: "Expected", value: (shown.total[0] + shown.total[1]) / 2, fill: "hsl(var(--primary))" },
    { name: "High", value: shown.total[1], fill: "hsl(var(--accent))" },
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-0">
      <div className="lg:col-span-2 p-6 sm:p-8 lg:border-r border-border/60">
        <h3 className="font-display text-2xl font-semibold mb-1">Plan your harvest</h3>
        <p className="text-sm text-muted-foreground mb-6">Pick a crop and your field area.</p>

        <div className="space-y-5">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Crop</Label>
            <Select value={cropId} onValueChange={setCropId}>
              <SelectTrigger className="rounded-xl mt-1.5 h-12 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CROPS.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="mr-2">{c.emoji}</span>{c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SliderRow label="Field area" value={area} setValue={setArea} min={0.5} max={50} step={0.5} unit="ha" />
          <SliderRow label="Avg. temperature" value={tempRange} setValue={setTempRange} min={5} max={45} unit="°C" />

          <div className="rounded-2xl bg-secondary/60 p-4 border border-border/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">In simple words</p>
            <p className="text-sm leading-relaxed">{shown.summary}</p>
          </div>

          <Button onClick={onAsk} variant="outline" className="w-full rounded-xl h-11">
            <MessageCircle className="w-4 h-4" /> Ask the assistant about {crop.name}
          </Button>
        </div>
      </div>

      <div className="lg:col-span-3 p-6 sm:p-8 bg-hero relative">
        <div className="absolute inset-0 bg-sun opacity-50 pointer-events-none" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Your report {loading ? "· updating…" : usingFallback ? "· offline" : "· live"}
          </p>
          <h4 className="font-display text-2xl font-semibold mb-5">{crop.emoji} {crop.name} · {area} ha</h4>

          {errorMsg && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-accent/40 bg-accent/10 p-3 text-xs text-foreground">
              <AlertTriangle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-5">
            <StatCard label="Yield / hectare" value={`${shown.perHa[0]}–${shown.perHa[1]}`} unit="tonnes" highlight />
            <StatCard label="Total harvest" value={`${shown.total[0]}–${shown.total[1]}`} unit="tonnes" />
            <StatCard label="Fertilizer (NPK)" value={`${shown.fertilizer[0]}–${shown.fertilizer[1]}`} unit="kg total" />
            <StatCard label="Pesticide" value={`${shown.pesticide[0]}–${shown.pesticide[1]}`} unit="L total" />
          </div>

          <div className="bg-card rounded-2xl border border-border/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total harvest range (tonnes)</p>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--secondary))" }}
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }}
                    formatter={(v: number) => [`${v.toFixed(1)} t`, "Harvest"]}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, highlight }: { label: string; value: string; unit: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 border ${highlight ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/60"}`}>
      <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{label}</p>
      <p className="font-display text-2xl font-semibold leading-tight">{value}</p>
      <p className={`text-xs ${highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{unit}</p>
    </div>
  );
}

/* ───────── Chat Assistant ───────── */

function ChatPanel({ cropId, location }: { cropId: string; location: string }) {
  const crop = CROPS.find((c) => c.id === cropId)!;
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "bot", text: `Namaste 🙏 I'm your Kisan AI assistant. I see you're growing **${crop.name}** in ${location}. Ask me anything — sowing time, fertilizer, pests, weather, or yield tips.` },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = assistantReply(q, { crop: cropId, location });
      setMessages((m) => [...m, { role: "bot", text: reply }]);
      setTyping(false);
    }, 700);
  };

  const quickReplies = [
    "When should I sow?",
    "Best fertilizer schedule?",
    "Weather advice this week",
    "How to improve yield?",
    "Pest control tips",
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-0 min-h-[560px]">
      <aside className="lg:col-span-2 p-6 sm:p-8 lg:border-r border-border/60 bg-hero relative">
        <div className="absolute inset-0 bg-sun opacity-40 pointer-events-none" />
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4 shadow-glow">
            <Bot className="w-7 h-7" />
          </div>
          <h3 className="font-display text-2xl font-semibold mb-2">Your farming buddy</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Context-aware: knows your crop and location. Tap a quick question to start.
          </p>

          <div className="rounded-2xl bg-card border border-border/60 p-4 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Conversation context</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2"><Sprout className="w-4 h-4 text-primary" /> {crop.emoji} {crop.name}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {location}</div>
            </div>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Quick questions</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs bg-card border border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-smooth px-3 py-1.5 rounded-full font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="lg:col-span-3 flex flex-col bg-card">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[460px]">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === "user" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
              }`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-secondary text-foreground rounded-tl-sm"
              }`}
              dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
              />
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Bot className="w-4 h-4" /></div>
              <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="border-t border-border/60 p-4 flex gap-2 bg-background/50"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sowing, fertilizer, yield..."
            className="rounded-xl bg-card h-12"
          />
          <Button type="submit" className="rounded-xl h-12 px-4 bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
