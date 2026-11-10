"use client";

import Oneko from "@/components/oneko";

/**
 * Mounts one Oneko pixel cat near the root of the app.
 * The component is client-only ("use client") and handles reduced-motion
 * automatically via useSyncExternalStore with a safe server snapshot.
 *
 * Props chosen for FocusFrame:
 *  - meow={false}       — sound assets not installed
 *  - skin="classic"     — clean pixel-art look matching the site's pixel-art theme
 *  - bubbleText         — cat-themed awake thoughts; nap/zoomie messages are built-in
 *  - napWhileTyping     — cat rests while the user types (e.g., in a search field)
 *  - perchOnHover       — cat visits hovered links / buttons
 *  - seasonal           — seasonal hats enabled (true = auto)
 *  - reducedMotion="rest" — shows a still sleeping cat instead of hiding it
 */
export default function CatLayer() {
  return (
    <Oneko
      meow={false}
      skin="classic"
      zIndex={30}
      napWhileTyping
      perchOnHover
      seasonal
      reducedMotion="rest"
      bubbleText={[
        "mrrp?",
        "prrr…",
        "…new tab?",
        "focus time 🐾",
        "got tasks?",
        "sniff sniff",
        "I see you",
        "pet me pls",
        "nom nom nom",
        "where cursor?",
        "zoomies soon",
        "just watching",
        "this tab smells nice",
        "todo: nap",
      ]}
    />
  );
}

