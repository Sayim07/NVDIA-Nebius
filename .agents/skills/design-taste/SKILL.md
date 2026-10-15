---
name: design-taste
description: Anti-slop UI design system, craft guide, and luxury animation standards. Enforces Linear/Stripe aesthetics, high-density typography, shadcn/ui, GSAP 3D physics, and Lenis smooth scrolling.
---

# Design Taste & Anti-Slop Craft System

Activate this skill whenever designing, scaffolding, or refining any frontend components or user interfaces.

## 1. The Design Taste Skill (Anti-Slop Manifesto)
- **Taste-Driven Philosophy:** A calm, data-dense, trustworthy, and authoritative interface. Every screen must feel handcrafted, responsive, and visually stunning at first glance.
- **NO AI Slop:** Strictly avoid generic AI templates:
  - NO neon glowing text or radioactive rainbow gradients.
  - NO floating cartoon 3D spheres, blobs, or generic illustrations.
  - NO giant rounded-3xl pill containers or playful toy radiuses.
  - NO emoji icons in place of UI glyphs (always use crisp Lucide icons).
  - NO heavy blurry drop-shadows (`shadow-2xl` blur slop).
- **Crisp Geometry & Elevation:** Rely on clean 1px borders (`border-slate-800` / `border-slate-700/50` in dark mode) and subtle disciplined elevation (`shadow-sm`, `shadow-[0_1px_2px_rgba(0,0,0,0.3)]`). Radii must be disciplined (`rounded-md` / `rounded-lg`).
- **Color as a Scarce Resource:** Deep muted canvas (`bg-slate-950`), elevated card surfaces (`bg-slate-900/80`), with deliberate semantic accent colors:
  - Cyber Emerald (`#10b981` / `text-emerald-400`): verified PII queries, approved policies, live status.
  - Cyber Rose (`#f43f5e` / `text-rose-500`): blocked PII tokens, NemoClaw violations, red-team alerts.
  - Cyber Cyan (`#06b6d4` / `text-cyan-400`): Tavily search status, web scouting badges, live links.
  - Cyber Violet (`#8b5cf6` / `text-violet-400`): Hermes memory recall, compiled YAML skills.
  - Cyber Amber (`#f59e0b` / `text-amber-400`): FinOps baseline warnings, offline simulation mode.
- **Typography Hierarchy:** Clean system sans (Inter / SF Pro fallbacks) for headers and labels; Monospace (`font-mono text-xs`) for IDs, codes, metrics, dates, and token costs.
- **Accessible Icons:** Use crisp Lucide icons (`lucide-react`) paired with text labels. Never color-code alone.

---

## 2. The 5-Pillar Animation & Interaction Stack
1. **Tailwind CSS + Lucide Icons:** Foundation for layout, styling, typography, and crisp iconography.
2. **shadcn/ui + Radix UI Primitives:** Accessible, unstyled primitives (`Dialog`, `DropdownMenu`, `Tooltip`, `Tabs`, `Sheet`, `Popover`, `Command`).
3. **GSAP (`@gsap/react` + `gsap`):** Physics-based 3D perspective card tilt with dynamic specular sheen, staggered entrance timelines, and luxury numerical count-up tickers.
4. **Framer Motion:** Fluid spring-animated layout transitions, tab indicators (`layoutId`), and micro-state changes.
5. **Lenis (`lenis`):** Inertial, momentum-based smooth scrolling throughout the entire application.

---

## 3. Signature Micro-Interactions
- **Global Command Palette (`Ctrl+K` / `Cmd+K`):** Accessible fuzzy-search launcher across all screens, presets, and actions using `cmdk`.
- **3D Perspective Tilt on Cards (`TiltCard`):** Subtle mouse-following 3D perspective rotation with a moving specular light reflection that springs back on leave.
- **Magnetic Hover on Primary Buttons (`Magnetic`):** Controls that subtly gravitate toward the cursor on hover.
- **Luxury Animated Numerical Counters (`AnimatedCounter`):** GSAP-driven live count-up tickers for FinOps token cost and latency metrics.
- **Staggered Entrances:** Data tables and card grids that smoothly glide into view with precision easing curves (`power2.out` / `power3.out`).

---

## 4. Package Installation Reference
```bash
npm install clsx tailwind-merge lucide-react zod gsap @gsap/react framer-motion lenis cmdk class-variance-authority
npm install -D @types/node
```

---

## 5. Flagship Component Blueprints

### Blueprint 1: Lenis Inertial Smooth Scrolling (`SmoothScrollProvider.tsx`)
```tsx
import React, { useEffect, useRef } from "react";
import Lenis from "lenis";

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
};
```

### Blueprint 2: GSAP 3D Perspective Tilt Card with Specular Sheen (`TiltCard.tsx`)
```tsx
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  sheen?: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  maxTilt = 8,
  sheen = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.set(card, { transformPerspective: 1000, transformStyle: "preserve-3d" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -maxTilt;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * maxTilt;

      gsap.to(card, { rotateX, rotateY, duration: 0.35, ease: "power2.out", overwrite: "auto" });

      if (sheenRef.current) {
        const sheenX = (x / rect.width) * 100;
        const sheenY = (y / rect.height) * 100;
        gsap.to(sheenRef.current, {
          background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 65%)`,
          duration: 0.2,
          ease: "none",
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });
      if (sheenRef.current) gsap.to(sheenRef.current, { background: "transparent", duration: 0.4 });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative rounded-lg bg-slate-900/80 border border-slate-800 shadow-sm transition-shadow hover:shadow-md will-change-transform overflow-hidden",
        className
      )}
    >
      {sheen && <div ref={sheenRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden="true" />}
      <div className="relative z-0 h-full">{children}</div>
    </div>
  );
};
```

### Blueprint 3: GSAP Magnetic Cursor Attraction (`Magnetic.tsx`)
```tsx
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const Magnetic: React.FC<{ children: React.ReactElement; strength?: number; className?: string }> = ({
  children,
  strength = 0.28,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = e.clientX - (left + width / 2);
      const y = e.clientY - (top + height / 2);
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.35, ease: "power2.out", overwrite: "auto" });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, { scope: ref });

  return <div ref={ref} className={`inline-block ${className}`}>{children}</div>;
};
```

### Blueprint 4: GSAP Numerical Count-Up Ticker (`AnimatedCounter.tsx`)
```tsx
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface CounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<CounterProps> = ({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.4,
  className = "",
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const countObj = useRef({ count: 0 });

  useGSAP(() => {
    if (!spanRef.current) return;
    countObj.current.count = 0;
    gsap.to(countObj.current, {
      count: value,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (spanRef.current) {
          spanRef.current.textContent = `${prefix}${countObj.current.count.toFixed(decimals)}${suffix}`;
        }
      },
    });
  }, [value, decimals, prefix, suffix, duration]);

  return <span ref={spanRef} className={className}>{prefix}0{suffix}</span>;
};
```
