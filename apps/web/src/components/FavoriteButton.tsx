"use client";
import { useState } from "react";
import { Icon } from "./Icon";

// C07 FavoriteButton
// ponytail: local on/off only. With sign-in: signed out opens AuthSheet (C12), signed in writes `favorites`.
export function FavoriteButton({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  return (
    <button type="button" className="heart" data-id="C07" aria-pressed={on} aria-label={`Salvează ${label} la favorite`} onClick={() => setOn(!on)}>
      <Icon name="heart" />
    </button>
  );
}
