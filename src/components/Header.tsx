
import Image from "next/image";
import Link from "next/link";

import Logo from "../../public/logo-icon.png";
import NavLinks from "./NavLinks";
import Marquee from "./Marquee";
import AuthButtons from "./AuthButtons";
import BanglaDate from "./BanglaDate";

const Header = () => {
  return (
    <header className="w-full bg-[#f9fbf9] text-[#202820]">
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
              width={20}
              height={20}
              priority
              className="rounded-xl object-cover"
            />

            <span className="flex flex-col">
              <span className="text-2xl font-extrabold leading-tight tracking-tight text-[#17231b]">
                বাজার দর
              </span>

              <BanglaDate className="mt-0.5 text-xs text-[#68716a]" />
            </span>
          </Link>

          <AuthButtons />
        </div>
      </div>

      <div className="border-b border-[#e5eae5]">
        <div className="mx-auto max-w-300 px-5">
          <NavLinks />
        </div>
      </div>

      <Marquee />
    </header>
  );
};

export default Header;