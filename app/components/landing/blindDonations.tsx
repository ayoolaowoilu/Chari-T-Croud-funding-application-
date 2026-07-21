"use client";

import { motion } from "framer-motion";
import { EyeOff, Shield, Heart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const benefits = [
  {
    icon: EyeOff,
    title: "Hidden from fundraisers",
    desc: "Your name is not shown on the campaign donor list. Give quietly when you prefer privacy.",
  },
  {
    icon: Shield,
    title: "Secure checkout",
    desc: "Payments run through Paystack. You stay in control of what the fundraiser sees.",
  },
  {
    icon: Heart,
    title: "True altruism",
    desc: "Give without seeking recognition. Help because it matters — not for the shout-out.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function BlindDonations() {
  const router = useRouter();

  return (
    <section className="py-20 md:py-28 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold uppercase tracking-[0.12em] text-slate-300 mb-6">
              <EyeOff size={14} />
              Private giving
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.12] mb-5">
              Blind donations
              <span className="block text-slate-400 text-xl md:text-2xl font-normal mt-3 tracking-normal">
                Give without being named
              </span>
            </h2>

            <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Prefer to help without a public name on the campaign? Toggle blind
              donation at checkout — fundraisers see &quot;Unknown&quot; while
              your payment still reaches the cause.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.push("/causes/get")}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors"
              >
                Browse causes
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => router.push("/how-it-works")}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/15 text-sm font-semibold text-slate-200 hover:bg-white/5 transition-colors"
              >
                Learn more
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={itemVariants}
                  className="flex gap-4 p-5 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-slate-200" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-1 tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            <p className="pt-2 text-xs text-slate-500">
              Toggle &quot;Donate anonymously&quot; on any campaign checkout
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
