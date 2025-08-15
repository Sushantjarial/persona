"use client";

import React, { useState, useEffect, useMemo, use } from "react";
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
      id: "dr-smith",
      name: "hitesh",
      image:
        "https://media.licdn.com/dms/image/v2/D4D03AQH8CXRHAKQd6Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1693777638244?e=2147483647&v=beta&t=J9gdqyexcRnLD1JoAU42jY7EEPFRj5-CWrYvjkA94So",
      gradient: "from-blue-400 to-cyan-400",
      hoverGradient: "from-green-500 to-cyan-500",
      message:
        "Hello! I'm Dr. Smith. Ready to explore the fascinating world of science and technology together?",
    },
    {
      id: "prof-johnson",
      name: "piyush",
      image:
        "https://yt3.googleusercontent.com/3acddexuFlA5yKRS2--11NeqhCiik-0cntUPjk_QjlsA4ScmQUPWNmeBLweVUQjWXTCLT26lsw=s900-c-k-c0x00ffffff-no-rj",
      gradient: "from-violet-400 to-pink-400",
      hoverGradient: "from-green-500 to-pink-500",
      message:
        "Greetings! I'm Professor Johnson. Let's dive into meaningful conversations about humanities and arts!",
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
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
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
        className={`max-w-4xl w-full text-center relative z-10 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Choose Your <span style={{ color: "var(--accent)" }}>Persona</span>
          </h1>
          <p
            className="text-xl opacity-90"
            style={{ color: "var(--foreground)" }}
          >
            Select your learning companion
          </p>
        </div>

        {/* Educator Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {educators.map((educator, i) => (
            <motion.button
              key={educator.id}
              className="group text-left relative cursor-pointer"
              onClick={() => {
                selectPersona(educator);
                router.push(`/chat/?n=${educator.name}`); // Navigate to chat with selected persona
              }}
              initial={cardHidden}
              animate={cardShow(i * 0.12)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <div
                className="relative backdrop-blur-lg rounded-3xl p-8 shadow-2xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_12px_40px_-5px_rgba(0,0,0,0.35)] group-hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.25)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
                }}
              >
                <span
                  className="absolute inset-[-4px] pointer-events-none animate-[spin_4s_linear_infinite] rounded-3xl p-[2px] z-0 opacity-30 group-hover:opacity-60 transition-opacity"
                  style={{
                    background:
                      "conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#25d366_50%,#E2CBFF_100%)",
                  }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${educator.gradient} opacity-20 group-hover:opacity-15 transition-opacity duration-500 rounded-3xl mix-blend-overlay`}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1600ms] ease-linear" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-6 relative">
                    <div
                      className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${educator.gradient} p-[3px] group-hover:scale-105 transition-transform duration-500 shadow-inner`}
                    >
                      <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center overflow-hidden shadow-lg">
                        <img
                          src={educator.image}
                          alt={educator.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <span className="pointer-events-none absolute -inset-2 rounded-full opacity-0 group-hover:opacity-40 blur-xl bg-gradient-to-br from-white/30 to-transparent transition-opacity"></span>
                  </div>
                  <h3
                    className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors duration-300"
                    style={{ color: "var(--foreground)" }}
                  >
                    {educator.name.charAt(0).toUpperCase() +
                      educator.name.slice(1)}
                  </h3>
                  <span
                    className={`inline-block px-5 py-2 rounded-full text-sm font-medium tracking-wide bg-gradient-to-r from-green-400/90  to-green-500/90 text-white shadow hover:shadow-md transition-shadow`}
                  >
                    Select
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Selected Persona Message */}
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
