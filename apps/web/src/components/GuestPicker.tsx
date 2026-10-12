"use client";

// C11 GuestPicker (uses the P05 stepper look)
export function GuestPicker({ value, max, onChange }: { value: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="guests" data-id="C11">
      <span id="guests-label">Călători</span>
      <div className="stepper" role="group" aria-labelledby="guests-label">
        <button type="button" aria-label="Mai puțini" disabled={value <= 1} onClick={() => onChange(value - 1)}>−</button>
        <output aria-live="polite">{value}</output>
        <button type="button" aria-label="Mai mulți" disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}
