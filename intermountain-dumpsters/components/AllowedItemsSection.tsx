"use client";
import { CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface AllowedItem {
  title: string;
  description: string;
}

interface NotAllowedItem {
  title: string;
  description: string;
}

interface AllowedItemsSectionProps {
  allowedItems: AllowedItem[];
  notAllowedItems: NotAllowedItem[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AllowedItemsSection({ 
  allowedItems, 
  notAllowedItems 
}: AllowedItemsSectionProps) {
  return (
    <div className="w-full bg-gray-50 py-20">
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
              <h3 className="text-2xl font-bold text-green-700 mb-2">
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
                  className="bg-white rounded-lg p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow flex items-start gap-4"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Not Allowed Items */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-700 mb-2">
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
                  className="bg-white rounded-lg p-6 shadow-sm border border-red-100 hover:shadow-md transition-shadow flex items-start gap-4"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <XCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-3xl mx-auto">
            <h4 className="font-semibold text-blue-800 mb-2">
              Need Help with Special Disposal?
            </h4>
            <p className="text-blue-700 text-sm">
              If you have questions about specific items or need guidance on proper disposal methods, 
              don&apos;t hesitate to contact us. We&apos;re here to help ensure safe and compliant waste management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 