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
    <Section variant="elevated" className="py-20 md:py-28 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[1320px] mx-auto"
      >
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Customer Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Loved by high-growth engineering teams
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            See what technical leaders and enterprise architects say about scaling on Prangon.
          </p>
        </div>

        <div className="relative px-4 sm:px-12">
          <Carousel
            plugins={[Autoplay({ delay: 3500, stopOnInteraction: false })]}
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
                    <Card className="h-full bg-card/70 backdrop-blur-md border border-border hover:border-primary/40 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
                      <CardContent className="flex flex-col h-full p-8 justify-between">
                        <div>
                          <QuoteIcon className="w-8 h-8 text-primary mb-6 opacity-80" />
                          <p className="text-base text-foreground mb-8 leading-relaxed">
                            "{testimonial.quote}"
                          </p>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                          <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-bold text-sm text-primary">
                            {testimonial.author.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{testimonial.author}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="-left-6 border-border hover:border-primary text-foreground hover:text-primary bg-card/80" />
              <CarouselNext className="-right-6 border-border hover:border-primary text-foreground hover:text-primary bg-card/80" />
            </div>
          </Carousel>
        </div>
      </motion.div>
    </Section>
  );
}
