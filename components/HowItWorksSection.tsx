"use client";

import Link from "next/link";
import { Calendar, Plus, Zap, Package, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

// Define a type for steps
export type Step = {
  number: number;
  title: string;
  description: string;
  icon: ReactNode;
};

const stepVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.6
    }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

const iconVariants = {
  hidden: { rotate: -180, scale: 0 },
  visible: { 
    rotate: 0, 
    scale: 1,
    transition: { 
      duration: 0.5
    }
  },
  hover: {
    scale: 1.1,
    transition: { duration: 0.2 }
  }
};

const numberVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: { 
      duration: 0.4
    }
  }
};

const defaultSteps: Step[] = [
  {
    number: 1,
    title: "Book Online or Call",
    description: "Choose your dumpster size and drop off date",
    icon: <Plus className="w-10 h-10" />
  },
  {
    number: 2,
    title: "Fast Delivery",
    description: "We'll deliver your dumpster to your location on your scheduled date or same day",
    icon: <Zap className="w-10 h-10" />
  },
  {
    number: 3,
    title: "Fill & Use",
    description: "Load your waste into the dumpster at your own pace for as long as you need. Includes 1000lbs of free disposal!",
    icon: <Package className="w-10 h-10" />
  },
  {
    number: 4,
    title: "Easy Pickup",
    description: "We'll pick up the dumpster and handle all waste disposal when you're done",
    icon: <CheckCircle className="w-10 h-10" />
  }
];

export default function HowItWorksSection({
  steps = defaultSteps,
  title = "How It Works",
  description = "Getting started is simple and straightforward. Here's how our process works:",
  ctaText = "Get Started Today",
  ctaHref = "https://app.icans.ai/customer-portal/intermountain-dumpsters/book/",
  ctaIcon = <Calendar className="w-6 h-6" />,
  backgroundColor = "#2C6B9E",
  textColor = "white"
}: {
  steps?: Step[];
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaIcon?: ReactNode;
  backgroundColor?: string;
  textColor?: string;
}) {
  return (
    <div 
      className="w-full py-20"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-6xl w-full mx-auto p-5">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {title}
          </motion.h2>
          <motion.p 
            className="text-lg opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {description}
          </motion.p>
        </motion.div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative group cursor-pointer"
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="text-center space-y-4">
                <div className="relative">
                  <motion.div 
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg"
                    style={{ color: backgroundColor }}
                    variants={iconVariants}
                  >
                    {step.icon}
                  </motion.div>
                  <motion.div 
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                    variants={numberVariants}
                  >
                    <span 
                      className="font-bold text-sm"
                      style={{ color: backgroundColor }}
                    >
                      {step.number}
                    </span>
                  </motion.div>
                </div>
                <motion.h3 
                  className="text-xl font-semibold"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                >
                  {step.title}
                </motion.h3>
                <motion.p 
                  className="opacity-80 text-sm leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.4 }}
                >
                  {step.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        {ctaText && ctaHref && (
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link 
                href={ctaHref}
                className="inline-flex items-center gap-3 bg-white px-10 py-4 rounded-lg font-semibold text-lg shadow-xl hover:bg-gray-50 active:bg-gray-100 transition-all border-2 border-white focus:outline-none focus:ring-4 focus:ring-white/30 transform duration-200"
                style={{ color: backgroundColor }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {ctaIcon}
                </motion.div>
                {ctaText}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 