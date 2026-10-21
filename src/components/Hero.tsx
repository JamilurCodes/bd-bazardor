
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  // Format today's date using the Bangla locale.
  const banglaDateInHero = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <section className="mx-auto my-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero banner: text on the left and illustration on the right */}
      <div className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-[#dce5dd] bg-[#fbfdfb] px-5 py-6 sm:px-8 sm:py-8 md:flex-row md:gap-6 lg:px-5 lg:py-3">

        {/* Left column: date, heading, description, and CTA */}
        <div className="flex w-full flex-col items-start md:w-150 lg:w-2/3">
          {/* Today's date */}
          <span className="mb-3 inline-flex rounded-full bg-[#e1f2e7] px-4 py-2 text-sm font-semibold text-[#07853e] sm:text-base">
            {banglaDateInHero}
          </span>

          {/* Main heading */}
          <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-[#202a23] sm:text-4xl lg:text-[42px]">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Supporting description */}
          <p className="mb-6 max-w-2xl text-base leading-7 text-[#69716b] sm:text-lg sm:leading-8">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
            দামের পরিবর্তন এক জায়গায়।
          </p>

          {/* Scroll to the products section on the same page */}
          <Link
            href="#সব-পণ্য"
            className="inline-flex items-center justify-center rounded-xl bg-[#07883e] px-7 py-3 text-base font-semibold text-white shadow-md transition-colors duration-200 hover:bg-[#066f34] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07883e] focus-visible:ring-offset-2"
          >
            সব পণ্য দেখুন
          </Link>
        </div>

        {/* Right column: hero illustration */}
        <div className="flex w-full items-center justify-center md:w-[35%] md:justify-end">
          <Image
            src="/bazar-hero.png"
            alt="বাজারের বিভিন্ন তাজা পণ্যের ঝুড়ি"
            width={320}
            height={260}
            priority
            className="w-full h-auto object-contain sm:max-w-80 md:max-w-90 lg:max-w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
