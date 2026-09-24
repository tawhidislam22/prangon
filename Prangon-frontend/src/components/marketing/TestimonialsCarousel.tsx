"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "./Section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { QuoteIcon } from "lucide-react";

const testimonials = [
  {
    quote: "Prangon completely changed how we handle multi-tenant isolation. What used to take months of careful database migrations now works out of the box.",
    author: "Elena Rodriguez",
    role: "VP Engineering, TechFlow",
  },
  {
    quote: "The RBAC model is incredibly robust. We can confidently onboard enterprise clients knowing their data is isolated cryptographically and logically.",
    author: "Marcus Chen",
    role: "CTO, SecureScale",
  },
  {
    quote: "Finally, a workspace infrastructure that doesn't feel like a compromise. The design is beautiful and the performance is unmatched.",
    author: "Sarah Jenkins",
    role: "Product Lead, Innovate",
  },
  {
    quote: "We replaced three separate internal tools with Prangon. The built-in billing and tenant management saved our startup.",
    author: "David Alaba",
    role: "Founder, SyncHQ",
  },
];

export function TestimonialsCarousel() {
  return (
    <Section variant="paper" className="py-10 md:py-12 border-t border-line overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[1400px] mx-auto"
      >
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl sm:text-5xl text-ink dark:text-white mb-4">
            Loved by engineering teams
          </h2>
          <p className="font-sans text-xl text-graphite dark:text-slate-300 max-w-2xl mx-auto">
            See what technical leaders are saying about building on Prangon's primitive architecture.
          </p>
        </div>

        <div className="relative px-4 sm:px-12">
          <Carousel
            plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="h-full bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-sm hover:border-cobalt dark:hover:border-cobalt/60 transition-colors duration-300">
                      <CardContent className="flex flex-col h-full p-8">
                        <QuoteIcon className="w-8 h-8 text-cobalt dark:text-blue-400 mb-6 opacity-80" />
                        <p className="text-lg text-ink dark:text-slate-100 mb-8 flex-grow leading-relaxed font-normal">
                          "{testimonial.quote}"
                        </p>
                        <div>
                          <p className="font-semibold text-ink dark:text-white">{testimonial.author}</p>
                          <p className="text-sm text-graphite dark:text-slate-400">{testimonial.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="-left-12 border-line dark:border-slate-800 hover:border-cobalt text-ink dark:text-white hover:text-cobalt dark:hover:text-cobalt bg-white dark:bg-slate-900" />
              <CarouselNext className="-right-12 border-line dark:border-slate-800 hover:border-cobalt text-ink dark:text-white hover:text-cobalt dark:hover:text-cobalt bg-white dark:bg-slate-900" />
            </div>
          </Carousel>
        </div>
      </motion.div>
    </Section>
  );
}
