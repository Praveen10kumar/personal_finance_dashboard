"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

function HeroSection() {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (imageElement) {
        if (scrollPosition > scrollThreshold) {
          imageElement.classList.add("scrolled");
        } else {
          imageElement.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="pb-20 pt-20">
      <div className="text-center mx-auto container">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Welcome to Your Smart <br /> Personal Finance Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8 mx-auto max-w-2xl">
          Manage your finances effectively and efficiently.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="mt-8 bg-[#6c47ff] text-white hover:bg-[#5a3ccf]"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      <div className="hero-image-wrapper">
        <div ref={imageRef} className="hero-image">
          <Image
            src="/hero-image.png"
            alt="Hero Image"
            width={600}
            height={400}
            className="rounded-lg shadow-2xl border mx-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
