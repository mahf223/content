"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Film,
  Image as ImageIcon,
  Wand2,
  Zap,
  PaintBucket,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-app">
      <Nav />

      <section className="relative px-6 lg:px-10 pt-20 lg:pt-28 pb-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_2px_rgba(31,187,232,0.6)]" />
            New · Animated MP4 export
          </span>
          <h1 className="mt-6 text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.02]">
            Charts that{" "}
            <span className="bg-gradient-to-br from-white via-white to-brand bg-clip-text text-transparent">
              animate themselves.
            </span>
          </h1>
          <p className="mt-6 text-lg text-white/60 leading-relaxed max-w-2xl">
            ChartAI turns your raw numbers into cinematic charts and exports
            them as ultra-HD images or 1080p MP4 videos — ready for decks,
            social, and product pages.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="primary" size="lg">
                Open the studio
                <ArrowRight size={16} />
              </Button>
            </Link>
            <a
              href="#features"
              className="text-sm text-white/60 hover:text-white px-2"
            >
              See how it works
            </a>
          </div>
        </motion.div>

        <PreviewCard />
      </section>

      <Features />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-950/60 border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-brand to-brand-700 grid place-items-center shadow-glow">
            <Sparkles size={16} className="text-ink-950" />
          </div>
          <span className="font-bold tracking-tight">ChartAI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/60">
          <a href="#features" className="hover:text-white">
            Features
          </a>
          <a href="#features" className="hover:text-white">
            Templates
          </a>
          <a href="#features" className="hover:text-white">
            Pricing
          </a>
        </nav>
        <Link href="/dashboard">
          <Button size="sm" variant="primary">
            Launch app
          </Button>
        </Link>
      </div>
    </header>
  );
}

function PreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-16 lg:mt-20 rounded-3xl glass-strong p-3 lg:p-4 overflow-hidden"
    >
      <div className="aspect-[16/9] rounded-2xl bg-[radial-gradient(120%_80%_at_80%_-10%,rgba(31,187,232,0.18),transparent_55%),radial-gradient(80%_60%_at_-10%_110%,rgba(31,187,232,0.10),transparent_60%),#0A0F15] grid place-items-center">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-white/40">
            Live preview
          </div>
          <div className="mt-3 text-2xl lg:text-3xl font-bold tracking-tight">
            Your chart, animated.
          </div>
          <p className="mt-2 max-w-md mx-auto text-sm text-white/55">
            Open the studio to edit your data and watch the chart animate in
            real time.
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button variant="primary" size="md">
                Open studio
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand/30 blur-3xl" />
    </motion.div>
  );
}

function Features() {
  const items = [
    {
      Icon: Wand2,
      title: "AI chart recommendations",
      body: "Paste data and ChartAI picks the most readable chart for your numbers.",
    },
    {
      Icon: Film,
      title: "1080p MP4 export",
      body: "Cinematic, frame-perfect entrance animations — rendered server-side with Remotion + FFmpeg.",
    },
    {
      Icon: ImageIcon,
      title: "Ultra-HD images",
      body: "Export PNG, JPG, or SVG at up to 3× device pixel ratio for crisp screenshots and decks.",
    },
    {
      Icon: PaintBucket,
      title: "Brand-perfect",
      body: "Bring your own colors, logo, and watermark. Manrope typography by default.",
    },
    {
      Icon: Layers,
      title: "Six chart types",
      body: "Pie, doughnut, bar, line, comparison, and circular stats — built for clarity.",
    },
    {
      Icon: Zap,
      title: "Instant feedback",
      body: "Real-time preview tied to the same renderer the MP4 export uses. What you see is what you get.",
    },
  ];
  return (
    <section
      id="features"
      className="px-6 lg:px-10 py-20 max-w-7xl mx-auto border-t border-white/[0.04]"
    >
      <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
        A studio built for{" "}
        <span className="text-brand">speed and clarity.</span>
      </h2>
      <p className="mt-3 text-white/55 max-w-2xl">
        Every feature is designed to remove friction between your data and a
        polished, share-ready visualization.
      </p>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ Icon, title, body }) => (
          <div
            key={title}
            className="group rounded-2xl glass p-5 hover:border-brand/30 transition-colors"
          >
            <div className="h-10 w-10 grid place-items-center rounded-xl bg-brand/10 text-brand">
              <Icon size={18} />
            </div>
            <h3 className="mt-4 text-base font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm text-white/55 leading-relaxed">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 lg:px-10 py-10 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-white/40">
        <div>© 2026 ChartAI</div>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Terms
          </a>
          <a href="#" className="hover:text-white">
            Status
          </a>
        </div>
      </div>
    </footer>
  );
}
