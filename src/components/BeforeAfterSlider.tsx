"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  clampSliderPosition,
  sliderPositionFromPointer,
} from "@/lib/slider-position";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  onDownloadAfter?: () => void;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before photo",
  afterAlt = "After preview",
  onDownloadAfter,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const labelId = useId();

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(sliderPositionFromPointer(clientX, rect.left, rect.width));
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    updateFromClientX(event.clientX);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(event.clientX);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setPosition((current) => clampSliderPosition(current - step));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setPosition((current) => clampSliderPosition(current + step));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  };

  useEffect(() => {
    if (!dragging) return;

    const stopDragging = () => setDragging(false);
    window.addEventListener("pointerup", stopDragging);
    return () => window.removeEventListener("pointerup", stopDragging);
  }, [dragging]);

  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <figcaption className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
        <span
          id={labelId}
          className="text-xs font-medium tracking-wide text-[var(--muted)] uppercase"
        >
          Before / after compare
        </span>
        {onDownloadAfter && (
          <button
            type="button"
            onClick={onDownloadAfter}
            className="text-xs text-[var(--muted)] hover:text-[var(--text)]"
          >
            Download after
          </button>
        )}
      </figcaption>

      <div
        ref={containerRef}
        className="relative aspect-square w-full touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterSrc}
          alt={afterAlt}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeSrc}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div
          role="slider"
          tabIndex={0}
          aria-labelledby={labelId}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-orientation="horizontal"
          aria-label="Reveal before and after"
          onKeyDown={onKeyDown}
          className="absolute top-0 bottom-0 z-10 -translate-x-1/2 cursor-ew-resize outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-0 bottom-0 w-0.5 -translate-x-1/2 bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.45)]" />
          <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/90 bg-[var(--surface)] shadow-lg">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden
              className="text-[var(--text)]"
            >
              <path
                d="M6 4L2 9l4 5M12 4l4 5-4 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-between px-3 text-[10px] font-semibold tracking-wider uppercase">
          <span className="rounded bg-black/50 px-2 py-0.5 text-white/90">
            Before
          </span>
          <span className="rounded bg-[var(--accent)]/90 px-2 py-0.5 text-[#0c0f14]">
            After
          </span>
        </div>
      </div>

      <p className="border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--muted)]">
        Drag the handle or use arrow keys to compare. Shift + arrow moves in 10%
        steps.
      </p>
    </figure>
  );
}
