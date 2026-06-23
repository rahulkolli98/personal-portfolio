"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { experiences } from "@/lib/data";

const fadeVariants = {
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
  hidden: { opacity: 0, y: 20 },
};

export default function TrustedBy() {
  const companiesWithLogos = experiences.filter(exp => exp.logo);

  return (
    <section className="py-16">
      {/* Heading */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeVariants}
        custom={0}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Trusted by</h2>
        <p className="mt-2 text-sm text-zinc-400">Companies I&apos;ve contributed to</p>
      </motion.div>

      {/* Logo Grid */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 place-items-center">
        {companiesWithLogos.map((exp, i) => (
          <motion.div
            key={exp.company}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeVariants}
            custom={i + 1}
            className="group relative w-32 h-32 flex items-center justify-center"
          >
            {/* Circle background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 shadow-lg transition-all duration-300 group-hover:border-indigo-500/60 group-hover:shadow-lg group-hover:shadow-indigo-500/20" />

            {/* Logo container */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              {exp.logo?.endsWith('.svg') ? (
                // SVG logo
                <div className="w-full h-full relative">
                  <Image
                    src={exp.logo}
                    alt={exp.company}
                    fill
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ) : (
                // PNG/JPG logo
                <Image
                  src={exp.logo}
                  alt={exp.company}
                  width={80}
                  height={80}
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              )}
            </div>

            {/* Company name on hover */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <p className="text-xs font-semibold text-zinc-300 text-center">{exp.company}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
