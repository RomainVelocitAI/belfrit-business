"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface ShowcaseItem {
  id: number
  image: string
  title: string
  category: "supports" | "formation"
}

const items: ShowcaseItem[] = [
  { id: 1, image: "/plv-poster.jpg", title: "Affiches premium", category: "supports" },
  { id: 2, image: "/plv-chalkboard.jpg", title: "Ardoises personnalisées", category: "supports" },
  { id: 3, image: "/plv-supports.jpg", title: "Matériel PLV complet", category: "supports" },
  { id: 4, image: "/formation-recipes.jpg", title: "Recettes exclusives", category: "formation" },
  { id: 5, image: "/formation-fiches.jpg", title: "Fiches techniques", category: "formation" },
  { id: 6, image: "/formation-recettes.jpg", title: "Support formation", category: "formation" },
]

export default function PlvShowcase() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] via-[#E31E24] to-[#000000] bg-clip-text text-transparent mb-4"
          >
            PLV & accompagnement
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-900 max-w-3xl mx-auto"
          >
            Un accompagnement complet pour garantir votre succès
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />

                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6"
                >
                  <div>
                    <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      item.category === "supports"
                        ? "bg-[#FFD700] text-black"
                        : "bg-[#E31E24] text-white"
                    }`}>
                      {item.category === "supports" ? "Supports visuels" : "Formation & recettes"}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Description */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#FFD700]/10 to-transparent p-8 rounded-xl border border-[#FFD700]/20"
          >
            <h3 className="text-2xl font-bold text-[#FFD700] mb-4">Supports visuels</h3>
            <ul className="space-y-2 text-gray-900">
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                Affiches, ardoises, chevalets
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                Stickers et autocollants
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2">•</span>
                Présentoirs et matériel
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#E31E24]/10 to-transparent p-8 rounded-xl border border-[#E31E24]/20"
          >
            <h3 className="text-2xl font-bold text-[#E31E24] mb-4">Formation & recettes</h3>
            <ul className="space-y-2 text-gray-900">
              <li className="flex items-start">
                <span className="text-[#E31E24] mr-2">•</span>
                Fiches techniques détaillées
              </li>
              <li className="flex items-start">
                <span className="text-[#E31E24] mr-2">•</span>
                Recettes exclusives
              </li>
              <li className="flex items-start">
                <span className="text-[#E31E24] mr-2">•</span>
                Formations cuisson et hotline technique
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
