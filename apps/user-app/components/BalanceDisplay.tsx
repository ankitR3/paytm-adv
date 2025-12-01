"use client";

import { useBalance } from "@repo/store";

export default function() {
  const balance = useBalance();
  return <div>
    hi there {balance}
  </div>
}