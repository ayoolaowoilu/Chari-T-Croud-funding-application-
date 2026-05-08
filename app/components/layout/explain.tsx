import React, { useState, useRef, useEffect } from 'react';

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
  const triggerRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    updatePosition(e);
    setIsVisible(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updatePosition(e);
  };

  const updatePosition = (e: React.MouseEvent) => {
    const offset = 12;
    let x = e.clientX + offset;
    let y = e.clientY + offset;

    // Prevent tooltip from going off-screen
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (x + rect.width > viewportWidth) {
        x = e.clientX - rect.width - offset;
      }
      if (y + rect.height > viewportHeight) {
        y = e.clientY - rect.height - offset;
      }
    }

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <span
        ref={triggerRef}
        className="inline relative cursor-help border-b-2 border-dotted border-blue-400 text-blue-600 font-medium transition-colors duration-200 hover:text-blue-800 hover:border-blue-600"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {topic}
      </span>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-sm leading-relaxed animate-in fade-in zoom-in-95 duration-150 pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <div className="font-semibold text-gray-900 mb-1">{topic}</div>
          <div className="text-gray-600">{details}</div>
          
          {link && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {link_details || 'Learn more'}
                <svg 
                  className="w-3 h-3 ml-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                  />
                </svg>
              </a>
            </div>
          )}
          
          {/* Little arrow pointer */}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45" />
        </div>
      )}
    </>
  );
};

export default Explain;