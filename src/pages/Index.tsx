import { Sprout, CloudSun, BarChart3, MessageCircle, MapPin, IndianRupee, Calendar, Languages, Wifi, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import heroFarmer from "@/assets/hero-farmer.jpg";
import iconGrain from "@/assets/icon-grain.png";
import iconSun from "@/assets/icon-sun.png";
import iconSoil from "@/assets/icon-soil.png";
import harvestFlatlay from "@/assets/harvest-flatlay.jpg";
import ToolsSection from "@/components/ToolsSection";

type Lang = "en" | "hi" | "mr";

const copy: Record<Lang, {
  nav: { features: string; how: string; pricing: string; cta: string };
  heroEyebrow: string;
  heroTitle: [string, string, string];
  heroSub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trust: string;
  featuresEyebrow: string;
  featuresTitle: string;
  features: { title: string; desc: string }[];
  howEyebrow: string;
  howTitle: string;
  steps: { title: string; desc: string }[];
  proofTitle: string;
  proofSub: string;
  stats: { value: string; label: string }[];
  pricingEyebrow: string;
  pricingTitle: string;
  plans: { name: string; price: string; period: string; features: string[]; cta: string; popular?: boolean }[];
  ctaTitle: string;
  ctaSub: string;
  footer: string;
}> = {
  en: {
    nav: { features: "Features", how: "How it works", pricing: "Pricing", cta: "Get started" },
    heroEyebrow: "Decision support for Indian farmers",
    heroTitle: ["Grow what", "the land", "wants."],
    heroSub: "Kisan AI turns your soil, weather and location into clear advice — which crop to sow, how much you'll harvest, and what to do next. In your language.",
    ctaPrimary: "Try a free recommendation",
    ctaSecondary: "See how it works",
    trust: "Trusted by farmers across 12 states · Hindi, Marathi & English",
    featuresEyebrow: "What it does",
    featuresTitle: "Three tools. One simple goal — a better harvest.",
    features: [
      { title: "Crop Recommendation", desc: "Tell us your location, we'll suggest the top 3 crops for your soil and season — with a clear reason for each." },
      { title: "Yield Prediction", desc: "See expected tonnes per hectare, fertilizer needs, and total harvest — in plain words, not jargon." },
      { title: "AI Farming Assistant", desc: "Ask anything: when to sow, best fertilizer schedule, why yields are low. Answers in your language." },
    ],
    howEyebrow: "How it works",
    howTitle: "Three steps. No spreadsheets.",
    steps: [
      { title: "Share your field", desc: "Tap 'Use my location' or pick your village. Adjust soil with simple sliders if you know them." },
      { title: "Get your plan", desc: "We combine weather, soil and agronomy rules to show your best crops and expected yield." },
      { title: "Ask the assistant", desc: "Chat with an AI agent that knows your crop and location. Get answers, not lectures." },
    ],
    proofTitle: "Built for the way farmers actually work",
    proofSub: "Mobile-first. Works on slow connections. Designed with farmers, not for them.",
    stats: [
      { value: "12", label: "States covered" },
      { value: "60+", label: "Crops in database" },
      { value: "3", label: "Languages supported" },
      { value: "<2s", label: "To get a recommendation" },
    ],
    pricingEyebrow: "Pricing",
    pricingTitle: "Free to start. Pay only when you grow.",
    plans: [
      { name: "Sapling", price: "Free", period: "forever", features: ["3 recommendations / day", "Basic yield prediction", "Hindi, Marathi, English"], cta: "Start free" },
      { name: "Harvest", price: "₹199", period: "per month", popular: true, features: ["Unlimited predictions", "Detailed reports & PDFs", "AI assistant priority", "Weather alerts"], cta: "Get Harvest" },
      { name: "Cooperative", price: "Custom", period: "for FPOs & agri-businesses", features: ["Bulk farmer onboarding", "Mandi price feeds", "Dedicated agronomist", "API access"], cta: "Talk to us" },
    ],
    ctaTitle: "Your next harvest starts with one tap.",
    ctaSub: "Join thousands of farmers already planning smarter seasons with Kisan AI.",
    footer: "© 2026 Kisan AI · Built with care for Indian agriculture",
  },
  hi: {
    nav: { features: "विशेषताएँ", how: "कैसे काम करता है", pricing: "मूल्य", cta: "शुरू करें" },
    heroEyebrow: "भारतीय किसानों के लिए स्मार्ट सलाह",
    heroTitle: ["वही उगाइए जो", "ज़मीन", "चाहती है।"],
    heroSub: "किसान AI आपकी मिट्टी, मौसम और स्थान को साफ़ सलाह में बदलता है — कौन सी फ़सल बोएँ, कितनी पैदावार होगी, और आगे क्या करें। आपकी भाषा में।",
    ctaPrimary: "मुफ़्त सुझाव लें",
    ctaSecondary: "कैसे काम करता है देखें",
    trust: "12 राज्यों के किसानों का भरोसा · हिंदी, मराठी और अंग्रेज़ी",
    featuresEyebrow: "क्या करता है",
    featuresTitle: "तीन उपकरण। एक लक्ष्य — बेहतर फ़सल।",
    features: [
      { title: "फ़सल सुझाव", desc: "अपना स्थान बताइए, हम आपकी मिट्टी और मौसम के लिए सबसे अच्छी 3 फ़सलें सुझाएँगे — हर एक का कारण भी।" },
      { title: "पैदावार अनुमान", desc: "प्रति हेक्टेयर अनुमानित टन, खाद की ज़रूरत और कुल फ़सल — सरल शब्दों में।" },
      { title: "AI कृषि सहायक", desc: "कुछ भी पूछें: कब बोएँ, खाद का सही समय, पैदावार कम क्यों। आपकी भाषा में जवाब।" },
    ],
    howEyebrow: "कैसे काम करता है",
    howTitle: "तीन कदम। कोई जटिलता नहीं।",
    steps: [
      { title: "खेत बताइए", desc: "'मेरा स्थान उपयोग करें' दबाएँ या अपना गाँव चुनें। मिट्टी की जानकारी हो तो स्लाइडर से बदलिए।" },
      { title: "योजना पाइए", desc: "हम मौसम, मिट्टी और कृषि नियमों से आपकी सबसे अच्छी फ़सलें और पैदावार दिखाते हैं।" },
      { title: "सहायक से पूछिए", desc: "AI सहायक से बात कीजिए जो आपकी फ़सल और स्थान जानता है। सीधा जवाब, बिना लम्बा भाषण।" },
    ],
    proofTitle: "किसानों के असली काम के तरीके के लिए बना",
    proofSub: "मोबाइल-पहले। धीमे इंटरनेट पर भी चलता है। किसानों के साथ बनाया, उनके लिए नहीं।",
    stats: [
      { value: "12", label: "राज्य" },
      { value: "60+", label: "फ़सलें" },
      { value: "3", label: "भाषाएँ" },
      { value: "<2 से", label: "सुझाव पाने में" },
    ],
    pricingEyebrow: "मूल्य",
    pricingTitle: "मुफ़्त शुरू करें। बढ़ने पर ही दें।",
    plans: [
      { name: "अंकुर", price: "मुफ़्त", period: "हमेशा", features: ["रोज़ 3 सुझाव", "बुनियादी पैदावार अनुमान", "हिंदी, मराठी, अंग्रेज़ी"], cta: "मुफ़्त शुरू करें" },
      { name: "फ़सल", price: "₹199", period: "प्रति माह", popular: true, features: ["असीमित अनुमान", "विस्तृत PDF रिपोर्ट", "AI सहायक प्राथमिकता", "मौसम अलर्ट"], cta: "फ़सल लें" },
      { name: "सहकारी", price: "अनुकूलित", period: "FPO और कृषि व्यवसाय के लिए", features: ["सामूहिक पंजीकरण", "मंडी भाव", "समर्पित कृषि विशेषज्ञ", "API पहुँच"], cta: "बात करें" },
    ],
    ctaTitle: "आपकी अगली फ़सल एक टैप से शुरू।",
    ctaSub: "हज़ारों किसानों के साथ जुड़िए जो किसान AI से अपना मौसम बेहतर बना रहे हैं।",
    footer: "© 2026 किसान AI · भारतीय कृषि के लिए प्यार से बनाया गया",
  },
  mr: {
    nav: { features: "वैशिष्ट्ये", how: "कसे चालते", pricing: "किंमत", cta: "सुरू करा" },
    heroEyebrow: "भारतीय शेतकऱ्यांसाठी हुशार सल्ला",
    heroTitle: ["जे जमीन", "मागते,", "तेच पिकवा."],
    heroSub: "किसान AI तुमची माती, हवामान आणि स्थान स्पष्ट सल्ल्यात बदलतो — कोणते पीक घ्यावे, किती उत्पन्न मिळेल, आणि पुढे काय करावे. तुमच्या भाषेत.",
    ctaPrimary: "मोफत सल्ला घ्या",
    ctaSecondary: "कसे चालते पहा",
    trust: "12 राज्यांतील शेतकऱ्यांचा विश्वास · हिंदी, मराठी आणि इंग्रजी",
    featuresEyebrow: "काय करते",
    featuresTitle: "तीन साधने. एक ध्येय — चांगले उत्पन्न.",
    features: [
      { title: "पीक शिफारस", desc: "तुमचे स्थान सांगा, आम्ही तुमच्या मातीसाठी सर्वोत्तम 3 पिके सुचवू — प्रत्येकाचे कारण देऊ." },
      { title: "उत्पन्न अंदाज", desc: "प्रति हेक्टर अपेक्षित टन, खताची गरज आणि एकूण पीक — साध्या शब्दांत." },
      { title: "AI शेती सहाय्यक", desc: "काहीही विचारा: कधी पेरावे, खताचे वेळापत्रक, उत्पन्न कमी का. तुमच्या भाषेत उत्तर." },
    ],
    howEyebrow: "कसे चालते",
    howTitle: "तीन पावले. गुंतागुंत नाही.",
    steps: [
      { title: "शेत सांगा", desc: "'माझे स्थान वापरा' दाबा किंवा गाव निवडा. माहिती असल्यास स्लायडरने माती बदला." },
      { title: "योजना मिळवा", desc: "आम्ही हवामान, माती आणि कृषी नियमांनी सर्वोत्तम पिके आणि उत्पन्न दाखवतो." },
      { title: "सहाय्यकाला विचारा", desc: "तुमचे पीक आणि स्थान ओळखणाऱ्या AI शी बोला. थेट उत्तर, लांबलचक भाषण नाही." },
    ],
    proofTitle: "शेतकरी जसे काम करतात तसे बनवले",
    proofSub: "मोबाइल-प्रथम. हळू इंटरनेटवरही चालते. शेतकऱ्यांसोबत बनवले, त्यांच्यासाठी नाही.",
    stats: [
      { value: "12", label: "राज्ये" },
      { value: "60+", label: "पिके" },
      { value: "3", label: "भाषा" },
      { value: "<2 से", label: "सल्ला मिळायला" },
    ],
    pricingEyebrow: "किंमत",
    pricingTitle: "मोफत सुरू. वाढाल तेव्हाच द्या.",
    plans: [
      { name: "अंकुर", price: "मोफत", period: "कायमचे", features: ["दिवसाला 3 शिफारशी", "मूलभूत उत्पन्न अंदाज", "हिंदी, मराठी, इंग्रजी"], cta: "मोफत सुरू करा" },
      { name: "हंगाम", price: "₹199", period: "दर महिना", popular: true, features: ["अमर्यादित अंदाज", "तपशीलवार PDF अहवाल", "AI सहाय्यक प्राधान्य", "हवामान अलर्ट"], cta: "हंगाम घ्या" },
      { name: "सहकारी", price: "सानुकूल", period: "FPO आणि कृषी व्यवसायांसाठी", features: ["सामूहिक नोंदणी", "मंडी दर", "समर्पित कृषी तज्ज्ञ", "API प्रवेश"], cta: "बोला" },
    ],
    ctaTitle: "तुमचा पुढचा हंगाम एका टॅपवर.",
    ctaSub: "हजारो शेतकऱ्यांसोबत जोडा जे किसान AI ने हुशार हंगाम नियोजित करत आहेत.",
    footer: "© 2026 किसान AI · भारतीय शेतीसाठी प्रेमाने बनवले",
  },
};

const featureIcons = [Sprout, BarChart3, MessageCircle];
const stepIcons = [MapPin, CloudSun, MessageCircle];

const Index = () => {
  const [lang, setLang] = useState<Lang>("en");
  const t = copy[lang];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/50">
        <nav className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-soft group-hover:rotate-6 transition-smooth">
              <Sprout className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">Kisan<span className="text-primary">.AI</span></span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-smooth">{t.nav.features}</a>
            <a href="#how" className="hover:text-primary transition-smooth">{t.nav.how}</a>
            <a href="#pricing" className="hover:text-primary transition-smooth">{t.nav.pricing}</a>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-secondary rounded-full p-1 text-xs font-semibold">
              {(["en", "hi", "mr"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-full transition-smooth ${lang === l ? "bg-primary text-primary-foreground shadow-soft" : "text-foreground/70 hover:text-foreground"}`}
                  aria-label={`Switch to ${l}`}
                >
                  {l === "en" ? "EN" : l === "hi" ? "हि" : "मरा"}
                </button>
              ))}
            </div>
            <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 hidden sm:inline-flex">{t.nav.cta}</Button>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-sun pointer-events-none" />
        <div className="absolute inset-0 grain-texture opacity-40 pointer-events-none" />

        {/* Mobile lang switch */}
        <div className="sm:hidden flex justify-center pt-4">
          <div className="flex items-center gap-1 bg-secondary rounded-full p-1 text-xs font-semibold">
            {(["en", "hi", "mr"] as Lang[]).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 rounded-full transition-smooth ${lang === l ? "bg-primary text-primary-foreground" : "text-foreground/70"}`}>
                {l === "en" ? "English" : l === "hi" ? "हिंदी" : "मराठी"}
              </button>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 pt-10 pb-16 md:pt-20 md:pb-28 relative">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            <div className="lg:col-span-7 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border/60 text-xs font-semibold text-primary mb-6 shadow-soft">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {t.heroEyebrow}
              </div>

              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.95] font-semibold tracking-tight">
                {t.heroTitle[0]}{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 italic text-primary">{t.heroTitle[1]}</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-3 bg-accent/50 -z-0 -rotate-1" />
                </span>{" "}
                {t.heroTitle[2]}
              </h1>

              <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                {t.heroSub}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 h-14 px-8 text-base shadow-card group">
                  {t.ctaPrimary}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                </Button>
                <Button size="lg" variant="ghost" className="rounded-full h-14 px-6 text-base hover:bg-secondary">
                  {t.ctaSecondary}
                </Button>
              </div>

              <p className="mt-6 text-xs text-muted-foreground flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary" />
                {t.trust}
              </p>
            </div>

            {/* Hero visual */}
            <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-card">
                <img
                  src={heroFarmer}
                  alt="Farmer at sunrise in a paddy field"
                  className="w-full h-full object-cover"
                  width={1536}
                  height={1280}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              </div>

              {/* Floating recommendation card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-10 bg-card rounded-2xl shadow-card p-4 w-64 border border-border/60 animate-float-slow">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
                  <Sprout className="w-3.5 h-3.5 text-primary" /> Top recommendation
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl font-semibold">Basmati Rice</span>
                  <span className="text-accent-foreground bg-accent px-2 py-0.5 rounded-full text-xs font-bold">94%</span>
                </div>
                <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "94%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Expected: 3.2–4.1 t/ha</p>
              </div>

              {/* Floating weather chip */}
              <div className="absolute -top-3 -right-2 sm:-right-6 bg-card rounded-2xl shadow-card p-3 border border-border/60 flex items-center gap-3 animate-float-slow" style={{ animationDelay: "1.5s" }}>
                <img src={iconSun} alt="" className="w-10 h-10" loading="lazy" width={40} height={40} />
                <div>
                  <div className="text-xs text-muted-foreground">Nashik</div>
                  <div className="font-display font-semibold">28°C · Clear</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="border-y border-border/50 bg-card/50 py-3 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-12 shrink-0 animate-[float-slow_20s_linear_infinite]">
                <span>🌾 Wheat</span><span>🍅 Tomato</span><span>🌽 Maize</span><span>🥥 Coconut</span><span>🫛 Pulses</span><span>🌶️ Chilli</span><span>🧄 Garlic</span><span>🍇 Grapes</span><span>☕ Coffee</span><span>🌾 Rice</span><span>🥔 Potato</span><span>🍌 Banana</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">{t.featuresEyebrow}</p>
            <h2 className="font-display text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
              {t.featuresTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {t.features.map((f, i) => {
              const Icon = featureIcons[i];
              const decorIcons = [iconGrain, iconSoil, iconSun];
              return (
                <article
                  key={i}
                  className="group relative bg-card rounded-3xl p-7 border border-border/60 hover:shadow-card transition-smooth hover:-translate-y-1 overflow-hidden"
                >
                  <img src={decorIcons[i]} alt="" className="absolute -right-6 -top-6 w-32 h-32 opacity-[0.06] group-hover:opacity-20 transition-smooth animate-sway" loading="lazy" width={128} height={128} />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                      <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" strokeWidth={2} />
                    </div>
                    <h3 className="font-display text-2xl font-semibold mb-3 leading-tight">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    <div className="mt-6 inline-flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-smooth">
                      Learn more <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 md:py-32 bg-secondary/40 relative overflow-hidden">
        <div className="absolute inset-0 grain-texture opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">{t.howEyebrow}</p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight mb-8">
                {t.howTitle}
              </h2>
              <div className="rounded-3xl overflow-hidden shadow-card aspect-square max-w-sm">
                <img src={harvestFlatlay} alt="Indian harvest flatlay" className="w-full h-full object-cover" loading="lazy" width={1024} height={1024} />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {t.steps.map((s, i) => {
                const Icon = stepIcons[i];
                return (
                  <div key={i} className="bg-card rounded-3xl p-6 sm:p-8 border border-border/60 shadow-soft flex gap-5 items-start">
                    <div className="shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-display text-2xl font-bold">
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-primary" />
                        <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PROOF / STATS */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={iconGrain} alt="" className="absolute top-10 right-10 w-64 animate-sway" loading="lazy" width={256} height={256} />
          <img src={iconGrain} alt="" className="absolute bottom-10 left-10 w-48 animate-sway" style={{ animationDelay: "1s" }} loading="lazy" width={192} height={192} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-3xl mb-14">
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              {t.proofTitle}
            </h2>
            <p className="mt-4 text-primary-foreground/80 text-lg">{t.proofSub}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {t.stats.map((s, i) => (
              <div key={i} className="border-l-2 border-accent pl-5">
                <div className="font-display text-5xl md:text-6xl font-semibold tracking-tight text-accent">{s.value}</div>
                <div className="mt-2 text-sm text-primary-foreground/70">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 grid sm:grid-cols-3 gap-4">
            {[
              { Icon: Wifi, label: lang === "en" ? "Works offline" : lang === "hi" ? "ऑफ़लाइन काम करता है" : "ऑफलाइन चालते" },
              { Icon: Languages, label: lang === "en" ? "3 Indian languages" : lang === "hi" ? "3 भारतीय भाषाएँ" : "3 भारतीय भाषा" },
              { Icon: ShieldCheck, label: lang === "en" ? "Your data stays yours" : lang === "hi" ? "आपका डेटा आपका" : "तुमचा डेटा तुमचा" },
            ].map(({ Icon, label }, i) => (
              <div key={i} className="flex items-center gap-3 bg-primary-foreground/5 backdrop-blur rounded-2xl p-4 border border-primary-foreground/10">
                <Icon className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">{t.pricingEyebrow}</p>
            <h2 className="font-display text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
              {t.pricingTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {t.plans.map((p, i) => (
              <div
                key={i}
                className={`relative rounded-3xl p-8 border transition-smooth flex flex-col ${
                  p.popular
                    ? "bg-primary text-primary-foreground border-primary shadow-card scale-[1.02]"
                    : "bg-card border-border/60 hover:border-primary/40 hover:shadow-soft"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Popular
                  </span>
                )}
                <h3 className="font-display text-2xl font-semibold mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-5xl font-semibold tracking-tight">{p.price}</span>
                </div>
                <p className={`text-sm mb-6 ${p.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{p.period}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${p.popular ? "text-accent" : "text-primary"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`rounded-full h-12 w-full ${
                    p.popular
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {p.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-card border border-border/60 p-10 md:p-20 text-center shadow-card">
            <div className="absolute inset-0 bg-sun opacity-70 pointer-events-none" />
            <img src={iconGrain} alt="" className="absolute -left-6 top-10 w-32 opacity-20 animate-sway" loading="lazy" width={128} height={128} />
            <img src={iconGrain} alt="" className="absolute -right-6 bottom-10 w-32 opacity-20 animate-sway" style={{ animationDelay: "1.5s" }} loading="lazy" width={128} height={128} />
            <div className="relative max-w-2xl mx-auto">
              <h2 className="font-display text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight mb-5">
                {t.ctaTitle}
              </h2>
              <p className="text-muted-foreground text-lg mb-8">{t.ctaSub}</p>
              <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 h-14 px-10 text-base shadow-card">
                {t.ctaPrimary}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/50 py-10">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Sprout className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-semibold">Kisan.AI</span>
          </div>
          <p className="text-xs text-muted-foreground">{t.footer}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Made in India</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Kharif 2026</span>
          </div>
        </div>
      </footer>

      {/* Floating chat button */}
      <button
        aria-label="Open AI assistant"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-glow flex items-center justify-center hover:scale-110 transition-smooth"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse" />
      </button>
    </div>
  );
};

export default Index;
