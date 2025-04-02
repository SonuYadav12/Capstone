import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import HeroSection from "@/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";

export default function LandingPage() {
  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto px-6 md:px-10">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-foreground">
            🚀 Powerful Features for Your Career Growth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border border-muted shadow-lg hover:shadow-2xl transition-all dark:bg-muted/50 hover:scale-105"
              >
                <CardContent className="py-6 text-center flex flex-col items-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mt-4 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 bg-muted/50 dark:bg-muted/30">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: "50+", label: "Industries Covered" },
              { value: "1000+", label: "Interview Questions" },
              { value: "95%", label: "Success Rate" },
              { value: "24/7", label: "AI Support" },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <h3 className="text-4xl font-extrabold text-primary">{stat.value}</h3>
                <p className="text-muted-foreground text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto px-6 md:px-10">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-foreground">
            📌 How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 shadow-md flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-xl text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 bg-muted/50 dark:bg-muted/30">
        <div className="container mx-auto px-6 md:px-10">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-foreground">
            ⭐ What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => (
              <Card key={index} className="bg-background shadow-lg dark:bg-muted/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Image
                      width={40}
                      height={40}
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="rounded-full border-2 border-primary/20"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-primary">{testimonial.company}</p>
                    </div>
                  </div>
                  <blockquote className="italic text-muted-foreground">
                    “{testimonial.quote}”
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full py-16">
        <div className="container mx-auto px-6 md:px-10">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-foreground">
            ❓ Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20 bg-primary/90 dark:bg-primary/80 rounded-lg text-primary-foreground">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold tracking-tight">🚀 Ready to Accelerate Your Career?</h2>
            <p className="text-lg text-primary-foreground/80 mt-4">
              Join thousands of professionals advancing their careers with AI-powered guidance.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="mt-6 h-12 hover:scale-105 transition-transform shadow-lg"
              >
                Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
