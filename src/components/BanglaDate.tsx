
"use client";

import { useEffect, useState } from "react";

interface BanglaDateProps {
  className?: string;
}

function getBanglaDate(): string {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

export default function BanglaDate({
  className = "",
}: BanglaDateProps) {
  const [date, setDate] = useState("");

  useEffect(() => {
    // Set the current Bangladesh date after hydration.
    const updateDate = () => {
      setDate(getBanglaDate());
    };

    updateDate();

    // Refresh the date periodically.
    const interval = setInterval(updateDate, 60_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <time
      className={className}
      suppressHydrationWarning
    >
      {date}
    </time>
  );
}