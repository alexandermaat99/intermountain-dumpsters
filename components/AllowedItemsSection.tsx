"use client";
import { CheckCircle, XCircle, Phone, Printer, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  allowedItems?: AllowedItem[];
  notAllowedItems?: NotAllowedItem[];
  phoneNumber?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const defaultAllowedItems = [
  { title: "Household Items", description: "General household items and personal belongings.", emoji: "🏠" },
  { title: "Personal Items", description: "Personal belongings and everyday items.", emoji: "👤" },
  { title: "Construction Items", description: "Construction materials and debris from building projects.", emoji: "🏗️" },
  { title: "Furniture", description: "Household furniture and furnishings.", emoji: "🪑" },
  { title: "Clothing", description: "Clothing and textiles.", emoji: "👕" },
  { title: "Plastics", description: "Plastic materials and containers.", emoji: "♻️" },
  { title: "Green Waste", description: "Yard waste, branches, and organic green materials.", emoji: "🌿" },
  { title: "Electronics*", description: "Electronic devices and equipment. Additional fee applies.", emoji: "📱" },
  { title: "Appliances*", description: "Household appliances. Additional fee applies.", emoji: "🔌" },
  { title: "Empty Paint & Aerosol Cans*", description: "Empty paint and aerosol cans only. Additional fee applies.", emoji: "🎨" },
  { title: "Tires*", description: "Tires require special handling. Additional fee applies.", emoji: "🛞" },
  { title: "Mattresses*", description: "Mattresses and box springs. Additional fee applies.", emoji: "🛏️" },
  { title: "Tires*", description: "Tires in heavy duty dumpster. Heavy duty dumpster required.", emoji: "🛞" },
  { title: "Asphalt*", description: "Asphalt materials. Heavy duty dumpster required.", emoji: "🛣️" },
  { title: "Dirt*", description: "Dirt and soil. Heavy duty dumpster required.", emoji: "🌍" },
  { title: "Roof Shingles*", description: "Roofing materials and shingles. Heavy duty dumpster required.", emoji: "🏠" }
];
const defaultNotAllowedItems = [
  { title: "Chemicals*", description: "Hazardous chemicals. Some may be accepted for an additional fee - contact us for details.", emoji: "🧪" },
  { title: "Pesticides*", description: "Pesticides and herbicides. Some may be accepted for an additional fee - contact us for details.", emoji: "🌿" },
  { title: "Medical Waste", description: "Medical waste and biohazardous materials are strictly prohibited.", emoji: "🏥" },
  { title: "Human Waste", description: "Human waste and sewage materials are not allowed.", emoji: "⚠️" },
  { title: "Deceased Animals", description: "Deceased animals require special disposal methods.", emoji: "🐾" },
  { title: "Hazardous Materials", description: "Hazardous materials that pose safety risks are prohibited.", emoji: "☣️" },
  { title: "Paint Cans with Liquid", description: "Paint cans containing liquid paint are not allowed. Only empty cans are accepted.", emoji: "🎨" },
  { title: "Aerosol Cans with Liquid", description: "Aerosol cans containing liquid are not allowed. Only empty cans are accepted.", emoji: "💨" },
  { title: "Oil Cans or Tanks", description: "Oil containers and tanks are not allowed in standard dumpsters.", emoji: "🛢️" },
  { title: "Fuel Cans or Tanks", description: "Fuel containers and tanks are prohibited for safety reasons.", emoji: "⛽" },
  { title: "Non-Household Batteries", description: "Non-household batteries require special disposal methods.", emoji: "🔋" },
  { title: "Combustibles", description: "Combustible materials and flammable items are not allowed.", emoji: "🔥" },
  { title: "Car Batteries", description: "Car batteries require special disposal and are not allowed in standard dumpsters.", emoji: "🚗" },
  { title: "Fire Extinguishers", description: "Fire extinguishers are not allowed and require special disposal.", emoji: "🧯" }
];

export default function AllowedItemsSection({
  allowedItems = defaultAllowedItems,
  notAllowedItems = defaultNotAllowedItems,
  phoneNumber
}: AllowedItemsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const ITEMS_TO_SHOW = 6; // Number of items to show when collapsed

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dumpster Allowed & Not Allowed Items - Intermountain Dumpsters</title>
          <style>
            @media print {
              @page {
                margin: 1in;
              }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              color: #2d5a27;
              border-bottom: 3px solid #2d5a27;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            h2 {
              color: #2d5a27;
              margin-top: 30px;
              margin-bottom: 15px;
              font-size: 1.5em;
            }
            h3 {
              color: #16a34a;
              margin-top: 20px;
              margin-bottom: 10px;
              font-size: 1.2em;
            }
            h4 {
              color: #dc2626;
              margin-top: 20px;
              margin-bottom: 10px;
              font-size: 1.2em;
            }
            ul {
              list-style: none;
              padding-left: 0;
            }
            li {
              margin: 8px 0;
              padding-left: 20px;
              position: relative;
            }
            .allowed li:before {
              content: "✓";
              color: #16a34a;
              font-weight: bold;
              position: absolute;
              left: 0;
            }
            .not-allowed li:before {
              content: "✗";
              color: #dc2626;
              font-weight: bold;
              position: absolute;
              left: 0;
            }
            .item-title {
              font-weight: bold;
              color: #1a1a1a;
            }
            .item-description {
              color: #666;
              font-size: 0.9em;
              margin-left: 5px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #2d5a27;
            }
            .contact-info {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #ccc;
              text-align: center;
            }
            .contact-info p {
              margin: 5px 0;
            }
            .company-info {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 2px solid #ccc;
              text-align: center;
              font-size: 0.9em;
            }
            .company-info p {
              margin: 3px 0;
            }
            .note {
              font-size: 0.85em;
              color: #666;
              font-style: italic;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>What Can & Can't Go in Your Dumpster</h1>
            <p><strong>Intermountain Dumpsters</strong></p>
          </div>
          
          <p>Understanding what materials are accepted helps ensure safe and compliant disposal. Here's what you can and cannot put in our rental dumpsters.</p>
          
          <h3>Allowed Items</h3>
          <p>These items are safe to dispose of in our dumpsters:</p>
          <ul class="allowed">
            ${allowedItems.map(item => `
              <li>
                <span class="item-title">${item.title}</span>
                <span class="item-description"> - ${item.description}</span>
              </li>
            `).join('')}
          </ul>
          
          <h4>Not Allowed Items</h4>
          <p>These items require special disposal methods:</p>
          <ul class="not-allowed">
            ${notAllowedItems.map(item => `
              <li>
                <span class="item-title">${item.title}</span>
                <span class="item-description"> - ${item.description}</span>
              </li>
            `).join('')}
          </ul>
          
          <div class="note">
            <p>* Items marked with an asterisk may have additional fees or require special dumpster types. Please contact us for details.</p>
          </div>
          
          <div class="company-info">
            <p><strong>Intermountain Dumpsters</strong></p>
            ${phoneNumber ? `<p><strong>Phone:</strong> ${phoneNumber}</p>` : ''}
            <p><strong>Website:</strong> <a href="https://intermountaindumpsters.com">intermountaindumpsters.com</a></p>
          </div>
          
          ${phoneNumber ? `
            <div class="contact-info">
              <p><strong>Need Help with Special Disposal?</strong></p>
              <p>If you have questions about specific items or need guidance on proper disposal methods, don't hesitate to contact us.</p>
            </div>
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 py-20">
      <div className="max-w-6xl w-full mx-auto p-5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Can & Can&apos;t Go in Your Dumpster
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Understanding what materials are accepted helps ensure safe and compliant disposal. 
            Here&apos;s what you can and cannot put in our rental dumpsters.
          </p>
          <Button
            onClick={handlePrint}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 mx-auto"
            aria-label="Print this list"
          >
            <Printer className="w-5 h-5" />
            Print List
          </Button>
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
              {(isExpanded ? allowedItems : allowedItems.slice(0, ITEMS_TO_SHOW)).map((item, index) => (
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
              {(isExpanded ? notAllowedItems : notAllowedItems.slice(0, ITEMS_TO_SHOW)).map((item, index) => (
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

        {/* Expand/Collapse Button for Entire Section */}
        {(allowedItems.length > ITEMS_TO_SHOW || notAllowedItems.length > ITEMS_TO_SHOW) && (
          <div className="text-center pt-8">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 mx-auto"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-5 h-5" />
                  Show Less Items
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  Show All Items
                </>
              )}
            </Button>
          </div>
        )}

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