/** Clamp slider reveal position to 0–100 (percent). */
export function clampSliderPosition(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/** Map pointer X within a container to a slider position (0–100). */
export function sliderPositionFromPointer(
  clientX: number,
  rectLeft: number,
  rectWidth: number,
): number {
  if (rectWidth <= 0) return 50;
  const ratio = (clientX - rectLeft) / rectWidth;
  return clampSliderPosition(ratio * 100);
}
