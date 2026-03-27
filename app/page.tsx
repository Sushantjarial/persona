"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Boxes } from "@/components/ui/background-boxes";
import { useRouter } from "next/navigation";

type Persona = {
  id: string;
  name: string;
  displayName: string;
  role: string;
  image: string;
  gradient: string;
  hoverGradient: string;
  message: string;
  tags: string[];
  accentColor: string;
};

export default function Home() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const educators: Persona[] = [
    {
      id: "hitesh",
      name: "hitesh",
      displayName: "Hitesh Choudhary",
      role: "Chai aur Code Creator",
      image:
        "https://media.licdn.com/dms/image/v2/D4D03AQH8CXRHAKQd6Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1693777638244?e=2147483647&v=beta&t=J9gdqyexcRnLD1JoAU42jY7EEPFRj5-CWrYvjkA94So",
      gradient: "from-blue-400 to-cyan-400",
      hoverGradient: "from-sky-500 to-cyan-500",
      message: "Hanji, chai ke saath coding karein. I love breaking down hard concepts into simple chai-fueled explanations!",
      tags: ["JavaScript", "React", "Python", "DSA"],
      accentColor: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: "piyush",
      name: "piyush",
      displayName: "Piyush Garg",
      role: "Node.js & DevOps Expert",
      image:
        "https://yt3.googleusercontent.com/3acddexuFlA5yKRS2--11NeqhCiik-0cntUPjk_QjlsA4ScmQUPWNmeBLweVUQjWXTCLT26lsw=s900-c-k-c0x00ffffff-no-rj",
      gradient: "from-violet-400 to-pink-400",
      hoverGradient: "from-violet-500 to-pink-500",
      message: "Hi bhai! Let's dive deep into Node.js, Docker, and the world of DevOps together.",
      tags: ["Node.js", "Docker", "DevOps", "AWS"],
      accentColor: "from-violet-500/20 to-pink-500/20",
    },
  ];

  // Stable pseudo-random star field (avoid hydration mismatch)
  const stars = useMemo(() => {
    const count = 60;
    const arr: {
      id: number;
      top: string;
      left: string;
      size: number;
      delay: number;
      duration: number;
      opacity: number;
    }[] = [];
    for (let i = 0; i < count; i++) {
      const seed = i + 1;
      const rand = (a: number) => {
        const x = Math.sin(seed * 999 + a * 13.37) * 10000;
        return x - Math.floor(x);
      };
      const size = rand(1) * 2 + 1;
      arr.push({
        id: i,
        top: `${rand(2) * 100}%`,
        left: `${rand(3) * 100}%`,
        size,
        delay: rand(4) * 2,
        duration: rand(5) * 3 + 2,
        opacity: rand(6) * 0.7 + 0.3,
      });
    }
    return arr;
  }, []);

  const cardHidden = { opacity: 0, y: 48, scale: 0.94 };
  const cardShow = (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay, type: "spring" as const, stiffness: 130, damping: 18 },
  });

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <Boxes className="z-0" />

      {/* Stars (dark mode) */}
      <div className="hidden dark:block absolute inset-0 z-0 pointer-events-none">
        {stars.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              filter: "drop-shadow(0 0 2px #fff)",
              animation: `starTwinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(90deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; animation-delay: 2s; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; animation-delay: 4s; }
      `}</style>

      <div
        className={`max-w-5xl w-full text-center relative z-10 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Ambient glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-24 top-12 h-40 w-40 rounded-full bg-gradient-to-br from-[#25d366]/25 via-white/30 to-transparent blur-3xl" />
          <div className="absolute -right-16 bottom-10 h-48 w-48 rounded-full bg-gradient-to-br from-white/30 via-[#25d366]/25 to-transparent blur-3xl" />
        </div>

        {/* Header */}
        <div className="mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5"
            style={{ color: "var(--foreground)" }}
          >
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ background: "var(--accent)" }}
            />
            Featured Educators
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Learn From Your Favourite{" "}
            <span
              className="relative inline-block"
              style={{ color: "var(--accent)" }}
            >
              Educator
              <span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full opacity-40"
                style={{ background: "var(--accent)" }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6, ease: "easeOut" }}
            className="text-base md:text-lg opacity-75 max-w-xl mx-auto leading-relaxed"
            style={{ color: "var(--foreground)" }}
          >
            Choose a guide, open a chat, and get concise answers tailored to
            how you like to learn.
          </motion.p>
        </div>

        {/* Educator Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {educators.map((educator, i) => (
            <motion.button
              key={educator.id}
              className="group relative w-full text-left h-full cursor-pointer"
              onClick={() => router.push(`/chat/?n=${educator.name}`)}
              initial={cardHidden}
              animate={cardShow(i * 0.13)}
              whileHover={{ scale: 1.025, y: -4 }}
              whileTap={{ scale: 0.985 }}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/35 bg-white/60 shadow-[0_20px_80px_-35px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-all duration-500 dark:border-white/10 dark:bg-white/5 group-hover:shadow-[0_28px_90px_-28px_rgba(0,0,0,0.7)] group-hover:border-white/50">
                {/* Card gradient overlay */}
                <div
                  className={`absolute inset-[1px] rounded-[22px] bg-gradient-to-br ${educator.gradient} opacity-10 transition-opacity duration-500 group-hover:opacity-25`}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-white/0 dark:from-white/10 dark:via-white/5" />
                <div className="absolute -left-10 -top-14 h-28 w-28 rounded-full bg-white/40 blur-3xl" />
                <div
                  className={`absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-gradient-to-br ${educator.accentColor} blur-3xl transition-opacity duration-500 group-hover:opacity-80`}
                />

                <div className="relative z-10 flex h-full flex-col gap-5 rounded-[22px] bg-white/70 px-7 py-6 dark:bg-white/5">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`relative h-16 w-16 flex-shrink-0 rounded-2xl bg-gradient-to-br ${educator.hoverGradient} p-[2px] shadow-md transition-transform duration-300 group-hover:scale-105`}
                    >
                      <div className="h-full w-full overflow-hidden rounded-[14px] bg-white/95 dark:bg-white/10">
                        <img
                          src={educator.image}
                          alt={educator.displayName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="pointer-events-none absolute inset-0 rounded-2xl border border-white/30" />
                    </div>
                    <div className="text-left min-w-0">
                      <p
                        className="text-[11px] uppercase tracking-[0.18em] opacity-60 font-medium mb-0.5"
                        style={{ color: "var(--foreground)" }}
                      >
                        {educator.role}
                      </p>
                      <h3
                        className="text-xl font-bold leading-tight"
                        style={{ color: "var(--foreground)" }}
                      >
                        {educator.displayName}
                      </h3>
                    </div>
                  </div>

                  {/* Message */}
                  <p
                    className="text-sm leading-relaxed opacity-80 text-left"
                    style={{ color: "var(--foreground)" }}
                  >
                    {educator.message}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {educator.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-black/8 bg-black/5 px-3 py-1 text-[11px] font-medium dark:border-white/10 dark:bg-white/10"
                        style={{ color: "var(--foreground)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA row */}
                  <div className="mt-auto flex items-center justify-between gap-4 pt-2 border-t border-black/5 dark:border-white/5">
                    <div className="flex flex-col text-left">
                      <span
                        className="text-[10px] uppercase tracking-[0.25em] opacity-55"
                        style={{ color: "var(--foreground)" }}
                      >
                        Click to start
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        Craft your next question
                      </span>
                    </div>
                    <span
                      className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm transition-transform duration-300 group-hover:translate-x-1"
                      style={{ background: "var(--accent)" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 text-xs opacity-40 tracking-wide"
          style={{ color: "var(--foreground)" }}
        >
          Powered by AI &mdash; inspired by real educators
        </motion.p>
      </div>

      {/* Floating decoration elements */}
      <div className="fixed top-20 left-10 w-4 h-4 bg-green-500/20 rounded-full animate-float" />
      <div className="fixed top-40 right-20 w-3 h-3 bg-green-500/15 rounded-full animate-float-delayed" />
      <div className="fixed bottom-32 left-20 w-2 h-2 bg-green-500/25 rounded-full animate-float-slow" />
    </div>
  );
}
