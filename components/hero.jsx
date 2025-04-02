"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Dynamic Text Animation
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 },
  }),
};


const HeroSection = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  return (
    <section className="relative w-full py-24 md:py-36 bg-gradient-to-b from-background to-muted/50 overflow-hidden">
      {/* Liquid Blob Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-10 left-10 w-[400px] h-[400px] bg-primary/30 rounded-full blur-[120px] opacity-30"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-secondary/40 rounded-full blur-[100px] opacity-20"
        ></motion.div>
      </div>

      <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
        {/* Animated Heading */}
        <motion.h1
          className="text-4xl font-extrabold md:text-6xl lg:text-7xl text-foreground leading-tight tracking-tight"
        >
          {["Your AI Career Coach for", "Professional Success"].map((word, i) => (
            <motion.span key={i} custom={i} variants={textVariants} initial="hidden" animate="visible">
              {word} <br />
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mx-auto mt-5 max-w-2xl text-lg md:text-xl text-muted-foreground"
        >
          Advance your career with personalized guidance, interview prep, and  
          AI-powered tools for job success.
        </motion.p>

        {/* CTA Buttons with Confetti Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center space-x-4 mt-8"
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="px-8 shadow-lg bg-primary dark:text-black hover:scale-105 transition-transform"
              onClick={() => {
                import("canvas-confetti").then((confetti) => {
                  confetti.default({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                  });
                });
              }}
            >
              Get Started 🚀
            </Button>
          </Link>
          <Link href="https://ai-mock-interview-murex-five.vercel.app/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="px-8 hover:bg-muted/80 hover:scale-105 transition-transform"
            >
              Try AI Interview 🤖
            </Button>
          </Link>
        </motion.div>

        {/* Floating Feature Cards */}
        

        {/* Hero Image with Tilt Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.05, rotate: 1 }}
          className="relative mt-12 flex justify-center"
        >
          <div className="relative max-w-4xl w-full p-3 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/10">
            <Image
              src={isDarkMode ? "/banner.jpeg" : "/banner.jpeg"}
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-xl transition-all duration-300"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
