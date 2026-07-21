'use client';

import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ExplainProps {
  topic: string;
  details: string;
  link?: string;
  link_details?: string;
}

const Explain: React.FC<ExplainProps> = ({ topic, details, link, link_details }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!tooltipRef.current) return;

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 16;

    let x = clientX + gap;
    let y = clientY + gap;

    // Right edge overflow — flip to left of cursor
    if (x + tooltipRect.width > viewportWidth - 16) {
      x = clientX - tooltipRect.width - gap;
    }
    // Bottom overflow — flip above cursor
    if (y + tooltipRect.height > viewportHeight - 16) {
      y = clientY - tooltipRect.height - gap;
    }
    // Left edge overflow
    if (x < 16) x = 16;
    // Top edge overflow
    if (y < 16) y = 16;

    setPosition({ x, y });
  }, []);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
    requestAnimationFrame(() => {
      updatePosition(e.clientX, e.clientY);
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isVisible) {
      updatePosition(e.clientX, e.clientY);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 200);
  };

  const handleTooltipMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleTooltipMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <span
        className="inline cursor-help font-semibold text-gray-900 underline decoration-gray-300 decoration-2 underline-offset-4 transition-colors duration-200 hover:decoration-gray-900"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {topic}
      </span>

      {isVisible &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-[9999] max-w-[260px] bg-white text-gray-900 rounded-xl shadow-xl border border-gray-200 p-4 text-sm leading-relaxed"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            <div className="font-semibold text-gray-900 mb-1.5 text-base">{topic}</div>
            <div className="text-gray-600 text-sm leading-relaxed">{details}</div>

            {link && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <a
                  href={link}
                  className="inline-flex items-center gap-1.5 text-gray-900 font-medium text-sm hover:underline underline-offset-4 transition-colors"
                >
                  {link_details || 'Learn more'}
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};

export default Explain;
