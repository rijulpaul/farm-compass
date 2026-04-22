// Mock crop knowledge base + rule-based logic for Kisan.AI
// All ranges are illustrative — designed to feel realistic for the Indian context.

export type Season = "kharif" | "rabi" | "zaid" | "perennial";

export interface Crop {
  id: string;
  name: string;
  emoji: string;
  seasons: Season[];
  // Ideal ranges
  n: [number, number];
  p: [number, number];
  k: [number, number];
  ph: [number, number];
  temp: [number, number];
  rainfall: [number, number]; // mm/season
  // Output ranges
  yieldPerHa: [number, number]; // tonnes/ha
  fertilizerKgPerHa: [number, number]; // kg/ha (NPK total)
  pesticideLPerHa: [number, number]; // L/ha
  whyShort: string;
  sowingMonths: string;
}

export const CROPS: Crop[] = [
  // Cereals & fibres
  { id: "rice", name: "Rice", emoji: "🌾", seasons: ["kharif"], n: [80, 120], p: [40, 60], k: [40, 60], ph: [5.5, 7], temp: [22, 32], rainfall: [800, 1800], yieldPerHa: [3.0, 4.5], fertilizerKgPerHa: [180, 240], pesticideLPerHa: [1.5, 2.5], whyShort: "Loves warm humid weather and clay-loam soils with steady water.", sowingMonths: "Jun – Jul" },
  { id: "maize", name: "Maize", emoji: "🌽", seasons: ["kharif", "rabi"], n: [80, 120], p: [40, 60], k: [30, 50], ph: [5.8, 7.5], temp: [18, 30], rainfall: [500, 800], yieldPerHa: [3.5, 5.5], fertilizerKgPerHa: [160, 220], pesticideLPerHa: [1.2, 2.2], whyShort: "Versatile crop, tolerates a wide soil range and moderate rainfall.", sowingMonths: "Jun – Jul / Oct" },
  { id: "jute", name: "Jute", emoji: "🌿", seasons: ["kharif"], n: [40, 80], p: [20, 40], k: [40, 60], ph: [6, 7.5], temp: [24, 37], rainfall: [1500, 2500], yieldPerHa: [2.0, 3.0], fertilizerKgPerHa: [120, 180], pesticideLPerHa: [1.0, 2.0], whyShort: "A humid, alluvial-soil fibre crop — thrives in monsoon-fed lowlands.", sowingMonths: "Mar – May" },
  { id: "cotton", name: "Cotton", emoji: "🪻", seasons: ["kharif"], n: [100, 150], p: [40, 60], k: [40, 60], ph: [6, 8], temp: [21, 35], rainfall: [500, 1000], yieldPerHa: [1.5, 2.5], fertilizerKgPerHa: [200, 280], pesticideLPerHa: [2.5, 4.0], whyShort: "Black cotton soils and warm dry climate maximise boll formation.", sowingMonths: "May – Jun" },
  { id: "coffee", name: "Coffee", emoji: "☕", seasons: ["perennial"], n: [80, 120], p: [40, 60], k: [60, 100], ph: [6, 6.5], temp: [18, 28], rainfall: [1500, 2500], yieldPerHa: [0.8, 1.5], fertilizerKgPerHa: [200, 300], pesticideLPerHa: [2.0, 3.5], whyShort: "Shaded hillsides with steady rain and mild temperatures suit it best.", sowingMonths: "Jun – Jul" },

  // Fruits
  { id: "coconut", name: "Coconut", emoji: "🥥", seasons: ["perennial"], n: [50, 100], p: [30, 50], k: [120, 200], ph: [5.5, 7.5], temp: [22, 35], rainfall: [1500, 2500], yieldPerHa: [10, 14], fertilizerKgPerHa: [300, 450], pesticideLPerHa: [1.0, 2.0], whyShort: "Coastal sandy loams and high humidity drive nut yield.", sowingMonths: "May – Jun / Sep – Oct" },
  { id: "papaya", name: "Papaya", emoji: "🫐", seasons: ["perennial"], n: [200, 250], p: [200, 250], k: [200, 250], ph: [6, 7], temp: [22, 32], rainfall: [1000, 1500], yieldPerHa: [40, 60], fertilizerKgPerHa: [400, 600], pesticideLPerHa: [2.0, 3.5], whyShort: "Heavy feeder — well-drained soil and frost-free climate are key.", sowingMonths: "Feb – Mar / Jun – Jul" },
  { id: "orange", name: "Orange", emoji: "🍊", seasons: ["perennial"], n: [100, 200], p: [50, 100], k: [100, 200], ph: [5.5, 7.5], temp: [13, 35], rainfall: [600, 1200], yieldPerHa: [15, 25], fertilizerKgPerHa: [350, 500], pesticideLPerHa: [2.5, 4.0], whyShort: "Subtropical climate and well-drained loam give the sweetest fruit.", sowingMonths: "Jun – Aug" },
  { id: "apple", name: "Apple", emoji: "🍎", seasons: ["perennial"], n: [70, 100], p: [35, 50], k: [70, 100], ph: [5.5, 6.5], temp: [10, 24], rainfall: [1000, 1250], yieldPerHa: [15, 25], fertilizerKgPerHa: [250, 400], pesticideLPerHa: [3.0, 5.0], whyShort: "Needs cold winters (chilling hours) — best in temperate hill zones.", sowingMonths: "Jan – Feb" },
  { id: "muskmelon", name: "Muskmelon", emoji: "🍈", seasons: ["zaid"], n: [80, 120], p: [40, 60], k: [40, 60], ph: [6, 7], temp: [22, 32], rainfall: [400, 600], yieldPerHa: [15, 25], fertilizerKgPerHa: [180, 250], pesticideLPerHa: [1.5, 2.5], whyShort: "Hot dry summers and sandy loam ripen the sweetest melons.", sowingMonths: "Feb – Mar" },
  { id: "watermelon", name: "Watermelon", emoji: "🍉", seasons: ["zaid"], n: [80, 120], p: [40, 60], k: [40, 60], ph: [6, 7], temp: [24, 32], rainfall: [400, 600], yieldPerHa: [25, 40], fertilizerKgPerHa: [180, 250], pesticideLPerHa: [1.5, 2.5], whyShort: "Loves heat and sandy river-bed soils — needs steady drip water.", sowingMonths: "Jan – Mar" },
  { id: "grapes", name: "Grapes", emoji: "🍇", seasons: ["perennial"], n: [100, 150], p: [50, 80], k: [100, 150], ph: [6.5, 7.5], temp: [15, 35], rainfall: [500, 800], yieldPerHa: [20, 35], fertilizerKgPerHa: [400, 600], pesticideLPerHa: [4.0, 6.0], whyShort: "Dry warm air at ripening + well-drained loam = top quality bunches.", sowingMonths: "Jan / Sep" },
  { id: "mango", name: "Mango", emoji: "🥭", seasons: ["perennial"], n: [100, 200], p: [50, 100], k: [100, 200], ph: [5.5, 7.5], temp: [24, 35], rainfall: [750, 2500], yieldPerHa: [8, 15], fertilizerKgPerHa: [300, 500], pesticideLPerHa: [2.0, 3.5], whyShort: "Hot dry spell at flowering boosts fruit set — deep loam preferred.", sowingMonths: "Jul – Aug" },
  { id: "banana", name: "Banana", emoji: "🍌", seasons: ["perennial"], n: [200, 250], p: [60, 90], k: [300, 400], ph: [6, 7.5], temp: [25, 35], rainfall: [1000, 2000], yieldPerHa: [40, 60], fertilizerKgPerHa: [500, 800], pesticideLPerHa: [2.0, 3.5], whyShort: "Heavy feeder — needs rich soil, warm humid air, and constant water.", sowingMonths: "Feb – Mar / Sep – Oct" },
  { id: "pomegranate", name: "Pomegranate", emoji: "🥭", seasons: ["perennial"], n: [60, 100], p: [30, 60], k: [60, 100], ph: [6.5, 7.5], temp: [18, 35], rainfall: [500, 800], yieldPerHa: [10, 18], fertilizerKgPerHa: [250, 400], pesticideLPerHa: [2.5, 4.0], whyShort: "Hardy fruit — tolerates drought, loves dry warm semi-arid zones.", sowingMonths: "Feb – Mar / Aug" },

  // Pulses
  { id: "lentil", name: "Lentil", emoji: "🫘", seasons: ["rabi"], n: [20, 30], p: [40, 60], k: [20, 40], ph: [6, 7.5], temp: [15, 25], rainfall: [300, 500], yieldPerHa: [0.8, 1.4], fertilizerKgPerHa: [80, 120], pesticideLPerHa: [0.8, 1.5], whyShort: "Cool, dry rabi pulse — fixes nitrogen and tolerates poor soils.", sowingMonths: "Oct – Nov" },
  { id: "blackgram", name: "Blackgram (Urad)", emoji: "🫘", seasons: ["kharif", "rabi"], n: [20, 30], p: [40, 60], k: [20, 40], ph: [6.5, 7.5], temp: [25, 35], rainfall: [600, 900], yieldPerHa: [0.8, 1.2], fertilizerKgPerHa: [80, 120], pesticideLPerHa: [1.0, 2.0], whyShort: "Short-duration pulse — restores soil nitrogen between cereals.", sowingMonths: "Jun – Jul / Oct" },
  { id: "mungbean", name: "Mungbean (Moong)", emoji: "🫛", seasons: ["kharif", "zaid"], n: [20, 30], p: [40, 60], k: [20, 40], ph: [6.2, 7.2], temp: [25, 35], rainfall: [400, 700], yieldPerHa: [0.8, 1.2], fertilizerKgPerHa: [80, 120], pesticideLPerHa: [1.0, 2.0], whyShort: "60-day pulse — perfect catch crop in summer or after wheat.", sowingMonths: "Mar – Apr / Jun – Jul" },
  { id: "mothbeans", name: "Mothbeans", emoji: "🫘", seasons: ["kharif"], n: [15, 25], p: [30, 50], k: [20, 40], ph: [6.5, 8.0], temp: [25, 35], rainfall: [200, 500], yieldPerHa: [0.4, 0.8], fertilizerKgPerHa: [60, 100], pesticideLPerHa: [0.8, 1.5], whyShort: "Drought-hardy arid pulse — best for sandy low-rainfall tracts.", sowingMonths: "Jun – Jul" },
  { id: "pigeonpeas", name: "Pigeonpeas (Tur)", emoji: "🌰", seasons: ["kharif"], n: [20, 30], p: [40, 60], k: [20, 40], ph: [6.5, 7.5], temp: [20, 35], rainfall: [600, 1000], yieldPerHa: [1.0, 1.8], fertilizerKgPerHa: [80, 130], pesticideLPerHa: [1.5, 2.5], whyShort: "Long-duration pulse — deep roots tap moisture, great for dryland.", sowingMonths: "Jun – Jul" },
  { id: "kidneybeans", name: "Kidneybeans (Rajma)", emoji: "🫘", seasons: ["kharif", "rabi"], n: [40, 60], p: [60, 80], k: [40, 60], ph: [6, 7.5], temp: [15, 25], rainfall: [600, 1000], yieldPerHa: [1.0, 1.8], fertilizerKgPerHa: [120, 180], pesticideLPerHa: [1.0, 2.0], whyShort: "Mild climate pulse — likes well-drained loam and steady moisture.", sowingMonths: "Jun – Jul / Oct" },
  { id: "chickpea", name: "Chickpea (Chana)", emoji: "🫛", seasons: ["rabi"], n: [20, 30], p: [40, 60], k: [20, 40], ph: [6, 8], temp: [10, 25], rainfall: [400, 700], yieldPerHa: [1.0, 1.8], fertilizerKgPerHa: [80, 130], pesticideLPerHa: [1.0, 2.0], whyShort: "Cool dry winters and residual soil moisture grow plump pods.", sowingMonths: "Oct – Nov" },
];

export interface SoilInputs {
  n: number; p: number; k: number;
  ph: number; temp: number; rainfall: number;
  season: Season;
}

export interface Recommendation {
  crop: Crop;
  score: number; // 0-100
  reasons: string[];
}

const inRange = (v: number, [lo, hi]: [number, number]) => v >= lo && v <= hi;
const closeness = (v: number, [lo, hi]: [number, number]) => {
  if (v >= lo && v <= hi) return 1;
  const mid = (lo + hi) / 2;
  const span = (hi - lo) / 2 || 1;
  const dist = Math.abs(v - mid) - span;
  return Math.max(0, 1 - dist / (span * 2));
};

export function recommendCrops(input: SoilInputs): Recommendation[] {
  const scored = CROPS
    .filter((c) => c.seasons.includes(input.season) || c.seasons.includes("perennial"))
    .map((crop) => {
      const factors = [
        { label: "Nitrogen", w: 1, s: closeness(input.n, crop.n) },
        { label: "Phosphorus", w: 1, s: closeness(input.p, crop.p) },
        { label: "Potassium", w: 1, s: closeness(input.k, crop.k) },
        { label: "Soil pH", w: 1.2, s: closeness(input.ph, crop.ph) },
        { label: "Temperature", w: 1.4, s: closeness(input.temp, crop.temp) },
        { label: "Rainfall", w: 1.4, s: closeness(input.rainfall, crop.rainfall) },
      ];
      const totalW = factors.reduce((a, f) => a + f.w, 0);
      const score = Math.round((factors.reduce((a, f) => a + f.w * f.s, 0) / totalW) * 100);

      const reasons: string[] = [];
      reasons.push(crop.whyShort);
      const matched = factors.filter((f) => f.s > 0.85).map((f) => f.label.toLowerCase());
      if (matched.length) reasons.push(`Excellent match on ${matched.slice(0, 3).join(", ")}.`);
      const weak = factors.filter((f) => f.s < 0.5).map((f) => f.label.toLowerCase());
      if (weak.length) reasons.push(`Watch out: ${weak.join(", ")} not ideal — adjust inputs.`);
      reasons.push(`Best sown: ${crop.sowingMonths}.`);
      return { crop, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}

export interface YieldReport {
  perHa: [number, number];
  total: [number, number];
  fertilizer: [number, number];
  pesticide: [number, number];
  summary: string;
}

export function predictYield(cropId: string, areaHa: number, conditionFactor = 1): YieldReport {
  const crop = CROPS.find((c) => c.id === cropId) ?? CROPS[0];
  const lo = +(crop.yieldPerHa[0] * conditionFactor).toFixed(1);
  const hi = +(crop.yieldPerHa[1] * conditionFactor).toFixed(1);
  return {
    perHa: [lo, hi],
    total: [+(lo * areaHa).toFixed(1), +(hi * areaHa).toFixed(1)],
    fertilizer: [Math.round(crop.fertilizerKgPerHa[0] * areaHa), Math.round(crop.fertilizerKgPerHa[1] * areaHa)],
    pesticide: [+(crop.pesticideLPerHa[0] * areaHa).toFixed(1), +(crop.pesticideLPerHa[1] * areaHa).toFixed(1)],
    summary: `For ${areaHa} ha of ${crop.name}, expect roughly ${lo}–${hi} tonnes per hectare — a total of about ${(lo * areaHa).toFixed(1)}–${(hi * areaHa).toFixed(1)} tonnes this season.`,
  };
}

// Simple rule-based assistant
export interface ChatMsg { role: "user" | "bot"; text: string; }

export function assistantReply(question: string, ctx: { crop?: string; location?: string }): string {
  const q = question.toLowerCase();
  const cropName = ctx.crop ? CROPS.find((c) => c.id === ctx.crop)?.name ?? ctx.crop : "your crop";
  const loc = ctx.location || "your area";

  if (/sow|plant|when/.test(q)) {
    const c = CROPS.find((x) => x.id === ctx.crop);
    return `For ${cropName} in ${loc}, the best sowing window is **${c?.sowingMonths ?? "the start of the season"}**. Sow when soil moisture is steady and temperatures are within ${c?.temp[0] ?? 20}–${c?.temp[1] ?? 30}°C.`;
  }
  if (/fertili[sz]er|npk|urea|dap/.test(q)) {
    const c = CROPS.find((x) => x.id === ctx.crop);
    return `Recommended NPK for ${cropName}: **N ${c?.n[0]}–${c?.n[1]} · P ${c?.p[0]}–${c?.p[1]} · K ${c?.k[0]}–${c?.k[1]} kg/ha**. Apply 50% N + full P,K at sowing, the rest of N at tillering and panicle initiation.`;
  }
  if (/weather|rain|temperature/.test(q)) {
    return `Current outlook for ${loc}: warm days, scattered showers expected. Avoid spraying on windy or rainy days. Irrigate early morning to reduce evaporation losses.`;
  }
  if (/yield|production|harvest/.test(q)) {
    const c = CROPS.find((x) => x.id === ctx.crop);
    return `Typical yield for ${cropName}: **${c?.yieldPerHa[0]}–${c?.yieldPerHa[1]} tonnes/ha**. To push it higher, ensure timely sowing, balanced NPK, and one extra irrigation at the critical flowering stage.`;
  }
  if (/disease|pest|insect/.test(q)) {
    return `For ${cropName}, scout your field weekly. Use yellow sticky traps for sucking pests. Spray neem oil (5 ml/L) at first sign — switch to a recommended insecticide only if damage exceeds 10%.`;
  }
  if (/best crop|what to grow|recommend/.test(q)) {
    return `Use the **Crop Recommendation** tab above — share your location and soil, and I'll suggest the top 3 crops with reasons.`;
  }
  return `I can help with sowing dates, fertilizer schedules, pest control, weather, and yield improvement for ${cropName}. Try one of the quick questions above 👆`;
}
