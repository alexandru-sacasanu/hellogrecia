"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface HeroSceneProps {
  image?: string;
}

/**
 * Hero background scene that seamlessly transitions between morning (06:00 - 18:00)
 * and sunset/evening (18:00 - 06:00) based on the user's local time.
 */
export function HeroScene({ image }: HeroSceneProps) {
  const [isDay, setIsDay] = useState(false);

  useEffect(() => {
    // Must run post-mount: the server and a visitor's browser can be in different timezones,
    // so computing this during render (SSR or a lazy useState initializer) risks a hydration mismatch.
    const hour = new Date().getHours();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDay(hour >= 6 && hour < 18);
  }, []);

  // If a custom image was configured in admin (not default hero.jpg), respect it
  if (image && image !== "/hero.jpg") {
    return (
      <Image
        className="scene"
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
      />
    );
  }

  return (
    <>
      <Image
        className={`scene scene-sunset ${isDay ? "scene-faded" : ""}`}
        src="/hero.jpg"
        alt="HelloGrecia Sunset"
        fill
        priority
        sizes="100vw"
      />
      <Image
        className={`scene scene-morning ${!isDay ? "scene-faded" : ""}`}
        src="/hero-morning.jpg"
        alt="HelloGrecia Morning"
        fill
        priority
        sizes="100vw"
      />
    </>
  );
}
