"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react"; // motion one react
import { Boxes } from "@/components/ui/background-boxes";
import { useRouter } from "next/navigation";
type Persona = {
  id: string;
  name: string;
  image: string;
  gradient: string;
  hoverGradient: string;
  message: string;
};

export default function Home() {
  const router = useRouter();

  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const educators: Persona[] = [
    {
      id: "hitesh",
      name: "hitesh",
      image:
        "https://media.licdn.com/dms/image/v2/D4D03AQH8CXRHAKQd6Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1693777638244?e=2147483647&v=beta&t=J9gdqyexcRnLD1JoAU42jY7EEPFRj5-CWrYvjkA94So",
      gradient: "from-blue-400 to-cyan-400",
      hoverGradient: "from-green-500 to-cyan-500",
      message: "Hello! I'm hitesh. I love chai and coding!",
    },
    {
      id: "piyush",
      name: "piyush",
      image:
        "https://yt3.googleusercontent.com/3acddexuFlA5yKRS2--11NeqhCiik-0cntUPjk_QjlsA4ScmQUPWNmeBLweVUQjWXTCLT26lsw=s900-c-k-c0x00ffffff-no-rj",
      gradient: "from-violet-400 to-pink-400",
      hoverGradient: "from-green-500 to-pink-500",
      message:
        "Hi there! I'm Piyush, lets dive deep into the world of node and devops",
    },
  ];

  const selectPersona = (persona: Persona) => setSelectedPersona(persona);

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

  const cardHidden = { opacity: 0, y: 40, scale: 0.95 };
  const cardShow = (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay, type: "spring" as const, stiffness: 140, damping: 18 },
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
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
      <div
        className={`max-w-6xl w-full text-center relative z-10 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-24 top-12 h-40 w-40 rounded-full bg-gradient-to-br from-[#25d366]/25 via-white/30 to-transparent blur-3xl" />
          <div className="absolute -right-16 bottom-10 h-48 w-48 rounded-full bg-gradient-to-br from-white/30 via-[#25d366]/25 to-transparent blur-3xl" />
        </div>

        {/* Header */}
        <div className="mb-10 space-y-4">
          <div
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5"
            style={{ color: "var(--foreground)" }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            Featured Educators
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Learn From Your Favourite{" "}
            <span style={{ color: "var(--accent)" }}>Educator</span>
          </h1>
          <p
            className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto"
            style={{ color: "var(--foreground)" }}
          >
            Choose a guide, open a chat, and get concise answers tailored to how
            you like to learn.
          </p>
        </div>

        {/* Educator Cards */}
        <div className="grid grid-cols-1  md:grid-cols-2 gap-10 items-stretch">
          {educators.map((educator, i) => (
            <motion.button
              key={educator.id}
              className="group relative w-full text-left h-full"
              onClick={() => {
                selectPersona(educator);
                router.push(`/chat/?n=${educator.name}`);
              }}
              initial={cardHidden}
              animate={cardShow(i * 0.12)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div className="relative h-full group-hover:cursor-pointer overflow-hidden rounded-3xl border border-white/35 bg-white/60 px-1 py-1 shadow-[0_20px_80px_-35px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-500 dark:border-white/10 dark:bg-white/5 group-hover:shadow-[0_22px_90px_-30px_rgba(0,0,0,0.75)]">
                <div
                  className={`absolute inset-[1px] rounded-[22px] bg-gradient-to-br ${educator.gradient} opacity-15 transition-opacity duration-500 group-hover:opacity-35`}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-white/0 dark:from-white/10 dark:via-white/5" />
                <div className="absolute -left-10 -top-14 h-28 w-28 rounded-full bg-white/40 blur-3xl" />
                <div className="absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-emerald-200/40 blur-3xl" />

                <div className="relative z-10 flex h-full flex-col gap-6 rounded-[20px] bg-white/70 px-8 py-7 dark:bg-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`relative h-16 w-16 rounded-2xl bg-gradient-to-br ${educator.hoverGradient} p-[2px] shadow-inner transition-transform duration-300 group-hover:scale-105`}
                      >
                        <div className="h-full w-full overflow-hidden rounded-[14px] bg-white/95 dark:bg-white/10 shadow-lg">
                          <img
                            src={educator.image}
                            alt={educator.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="pointer-events-none absolute inset-0 rounded-2xl border border-white/30" />
                      </div>
                      <div className="text-left">
                        <p
                          className="text-xs uppercase tracking-[0.2em] opacity-80"
                          style={{ color: "var(--foreground)" }}
                        ></p>
                        <h3
                          className="text-2xl font-semibold leading-tight"
                          style={{ color: "var(--foreground)" }}
                        >
                          {educator.name.charAt(0).toUpperCase() +
                            educator.name.slice(1)}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p
                    className="text-sm leading-relaxed opacity-90"
                    style={{ color: "var(--foreground)" }}
                  >
                    {educator.message}
                  </p>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="flex flex-col text-left">
                      <span
                        className="text-xs uppercase tracking-[0.25em] opacity-70"
                        style={{ color: "var(--foreground)" }}
                      >
                        Click to start
                      </span>
                      <span
                        className="text-lg font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        Craft your next question
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed top-20 left-10 w-4 h-4 bg-green-500/20 rounded-full animate-float"></div>
      <div className="fixed top-40 right-20 w-3 h-3 bg-green-500/15 rounded-full animate-float-delayed"></div>
      <div className="fixed bottom-32 left-20 w-2 h-2 bg-green-500/25 rounded-full animate-float-slow"></div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-180deg);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(90deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
