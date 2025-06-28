"use client";
import { CheckCircle, XCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface AllowedItem {
  title: string;
  description: string;
  emoji: string;
}

interface NotAllowedItem {
  title: string;
  description: string;
  emoji: string;
}

interface AllowedItemsSectionProps {
  allowedItems: AllowedItem[];
  notAllowedItems: NotAllowedItem[];
  phoneNumber?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AllowedItemsSection({ 
  allowedItems, 
  notAllowedItems,
  phoneNumber
}: AllowedItemsSectionProps) {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 py-20">
      <div className="max-w-6xl w-full mx-auto p-5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Can & Can&apos;t Go in Your Dumpster
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding what materials are accepted helps ensure safe and compliant disposal. 
            Here&apos;s what you can and cannot put in our rental dumpsters.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Allowed Items */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                Allowed Items
              </h3>
              <p className="text-muted-foreground">
                These items are safe to dispose of in our dumpsters
              </p>
            </div>
            <div className="space-y-4">
              {allowedItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-2 border-green-300 dark:border-green-600 hover:shadow-md transition-shadow flex items-start gap-4"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{item.description}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Not Allowed Items */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
                Not Allowed Items
              </h3>
              <p className="text-muted-foreground">
                These items require special disposal methods
              </p>
            </div>
            <div className="space-y-4">
              {notAllowedItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-2 border-red-300 dark:border-red-600 hover:shadow-md transition-shadow flex items-start gap-4"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{item.description}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 max-w-3xl mx-auto">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Need Help with Special Disposal?
            </h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
              If you have questions about specific items or need guidance on proper disposal methods, 
              don&apos;t hesitate to contact us. We&apos;re here to help ensure safe and compliant waste management.
            </p>
            {phoneNumber && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <a
                  href={`tel:${phoneNumber.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-sm shadow-md hover:bg-blue-700 active:bg-blue-800 transition-all border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                >
                  <Phone className="w-4 h-4" />
                  Call Us: {phoneNumber}
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 