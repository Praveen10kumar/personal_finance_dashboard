import HeroSection from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import { Link as LucideLink } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";



export default function Home() {
  return (
    <div className="mt-40">
      <HeroSection />

      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((statsData,index) => (
              <div key={index} className="text-center">
                {/* Render stat properties here,stat.title or stat.value */}
                <div className="text-4xl font-bold text-blue-600 mb-2">{statsData.title}</div>
                <div className="text-gray-600">{statsData.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">A smarter way to manage your finances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card key={index} className="p-6">
                <CardContent className="text-center space-y-4 pt-4">
                  {feature.icon}
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How we work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-16 h-16 mx-auto bg-blue-100 flex items-center justify-center mb-6">{step.icon}</div>
                <h3 className="text-lg font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>

            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Listen from our Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((Testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="text-center space-y-4 pt-4">
                  <div className="flex items-center justify-center mb-4">
                    <Image
                      src={Testimonial.image}
                      alt={Testimonial.name}
                      width={64}
                      height={64}
                      className="rounded-full mx-auto mb-4"
                    />
                    <div className="text-gray-600 ml-4">
                      <div className="font-semibold">{Testimonial.name}</div>
                      <div className="text-sm text-gray-600">{Testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4">"{Testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-blue-500">
        <div className="container mx-auto px-4 text-center ">
          <h2 className="text-3xl text-white font-bold text-center mb-4">Handle your finances smarter</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Join us today and take control of your financial future</p>
          <Link href="/dashboard" className="text-lg text-white mb-6">
            <Button size="lg" className=" text-blue-500 hover:text-blue-40 animate-bounce">Get Started</Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
