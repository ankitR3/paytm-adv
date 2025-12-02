"use client"

import { useBalance

export default function() {
  const balance = useBalance();
  return <div>
    hi there {balance}
  </div>
}