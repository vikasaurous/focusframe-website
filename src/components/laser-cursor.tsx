"use client";

import { useEffect } from "react";
import { mountLaserCursor } from "@/lib/laser-cursor-dom";

export function LaserCursor({ zIndex }: { zIndex: number }) {
  useEffect(() => mountLaserCursor(zIndex), [zIndex]);
  return null;
}
