
import Link from "next/link";

const AuthButtons = () => {
  return (
    <div className="flex shrink-0 items-center gap-5">
      <Link
        href="/signin"
        className="text-sm font-semibold text-[#202820] transition-colors hover:text-[#078640]"
      >
        সাইন ইন
      </Link>

      <Link
        href="/signup"
        className="rounded-xl bg-[#078c43] px-5 py-3 text-sm font-semibold text-white shadow-[0_3px_5px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#067638] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078c43]"
      >
        সাইন আপ
      </Link>
    </div>
  );
};

export default AuthButtons;
