"use client";
import "./globals.css";
import Lightfall from "@/components/Lightfall";
import CardNav from "@/components/CardNav";
import TextBlockEffect, { TextBlock } from "@/ui/components/TextBlockEffect";
import SpecularButton from "@/components/SpecularButton";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // queryParams: {
        //   prompt: "select_account",
        // },
      },
    });
  };

  const items = [
    {
      label: "About",
      bgColor: "#1B1722",
      textColor: "#fff",
      links: [
        {
          label: "Company",
          href: "/about/company",
          ariaLabel: "About Company",
        },
        {
          label: "Careers",
          href: "/about/careers",
          ariaLabel: "About Careers",
        },
      ],
    },
    {
      label: "Projects",
      bgColor: "#2F293A",
      textColor: "#fff",
      links: [
        {
          label: "Featured",
          href: "/projects/featured",
          ariaLabel: "Featured Projects",
        },
        {
          label: "Case Studies",
          href: "/projects/case-studies",
          ariaLabel: "Project Case Studies",
        },
      ],
    },
    {
      label: "Contact",
      bgColor: "#2F293A",
      textColor: "#fff",
      links: [
        {
          label: "Email",
          href: "mailto:hello@freelynk.com",
          ariaLabel: "Email us",
        },
        {
          label: "Twitter",
          href: "https://twitter.com/freelynk",
          ariaLabel: "Twitter",
        },
        {
          label: "LinkedIn",
          href: "https://linkedin.com/company/freelynk",
          ariaLabel: "LinkedIn",
        },
      ],
    },
  ];
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Lightfall
          colors={["#000aff", "#ff0000", "#ffffff"]}
          backgroundColor="#0A29FF"
          speed={0.4}
          streakCount={2}
          streakWidth={0.2}
          streakLength={1}
          glow={1}
          density={0.3}
          twinkle={1}
          zoom={1}
          backgroundGlow={0}
          opacity={1}
          mouseInteraction
          mouseStrength={0}
          mouseRadius={0}
        />
      </div>

      <CardNav
        logo="/logo.svg"
        logoAlt="Company Logo"
        logoText="FreeLynk"
        items={items}
        baseColor="#111"
        menuColor="#fff"
        buttonBgColor="#fff"
        buttonTextColor="#111"
        ease="power3.out"
      />

      <TextBlockEffect className="absolute inset-0 z-10 bg-transparent flex items-center justify-center">
        <section className="flex h-full w-full flex-col items-center justify-center gap-8 px-8">
          <div className="flex w-full flex-wrap justify-center">
            <Badge className="bg-white text-black text-lg h-8 px-4 ">
              New
              <Badge className="bg-black text-white h-7 px-4 translate-x-[13px]">
                Just shipped v2.0
              </Badge>
            </Badge>
          </div>
          <TextBlock
            blockColor="#000"
            textColor="#ededed"
            fontFamily="var(--font-sans), sans-serif"
          >
            Your Talent.
            <br />
            Your Platform.
            <br />
            Your Choice.
          </TextBlock>
          <SpecularButton
            size="md"
            radius={12}
            tint="#ffffff"
            tintOpacity={0.2}
            blur={1}
            textColor="#f5f5f5"
            lineColor="#ffffff"
            baseColor="#525252"
            intensity={1}
            shineSize={10}
            shineFade={40}
            thickness={1}
            speed={0.35}
            followMouse
            proximity={250}
            autoAnimate={false}
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </SpecularButton>
        </section>
      </TextBlockEffect>
    </div>
  );
}
