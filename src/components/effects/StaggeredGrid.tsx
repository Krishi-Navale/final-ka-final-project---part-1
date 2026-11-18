import React, { useEffect, useRef, useState } from 'react';

interface StaggeredGridProps {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
}

export const StaggeredGrid: React.FC<StaggeredGridProps> = ({
  children,
  className = '',
  staggerMs = 110,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const childArray = React.Children.toArray(children);

  return (
    <div ref={gridRef} className={className}>
      {childArray.map((child, idx) => {
        const animStyle: React.CSSProperties = {
          transform: isVisible ? 'translateY(0px)' : 'translateY(32px)',
          opacity: isVisible ? 1 : 0,
          transition: `transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${idx * staggerMs}ms, opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${idx * staggerMs}ms`,
          willChange: 'transform, opacity',
        };

        // Clone the child directly so CSS Grid classes (e.g. md:col-span-4, md:col-span-8, lg:col-span-*)
        // remain on the direct child of the grid container instead of being trapped inside a wrapper div.
        if (React.isValidElement<{ style?: React.CSSProperties }>(child)) {
          return React.cloneElement(child, {
            key: child.key ?? idx,
            style: {
              ...(child.props.style || {}),
              ...animStyle,
            },
          });
        }

        return (
          <div key={idx} style={animStyle}>
            {child}
          </div>
        );
      })}
    </div>
  );
};
