
import Image from "next/image";
import Link from "next/link";

import Logo from "../../public/logo-icon.png";
import NavLinks from "./NavLinks";
import Marquee from "./Marquee";
import AuthButtons from "./AuthButtons";

const Header = () => {
  const banglaDate = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="w-full bg-[#f9fbf9] text-[#202820]">
      {/* Row 1: Logo, date and authentication */}
      <div className="border-b border-[#e5eae5]">
        <div className="mx-auto flex max-w-300 flex-col items-center justify-between gap-4 px-5 py-4 sm:flex-row">
          <Link
            href="/"
            aria-label="বাজার দর হোমপেজ"
            className="flex shrink-0 items-center gap-2.5"
          >
            <Image
              src={Logo}
              alt="বাজার দর লোগো"
              width={30}
              height={30}
              priority
              className="rounded-xl object-cover"
            />

            <span className="flex flex-col">
              <span className="text-2xl font-extrabold leading-tight tracking-tight text-[#17231b]">
                বাজার দর
              </span>

              <span className="mt-0.5 text-xs text-[#68716a]">
                {banglaDate}
              </span>
            </span>
          </Link>

          <AuthButtons />
        </div>
      </div>

      {/* Row 2: Product categories */}
      <div className="border-b border-[#e5eae5]">
        <div className="mx-auto max-w-300 px-5">
          <NavLinks />
        </div>
      </div>

      {/* Row 3: Scrolling market prices */}
      <Marquee />
    </header>
  );
};

export default Header;
