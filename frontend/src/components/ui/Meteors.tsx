// frontend/src/components/ui/Meteors.tsx
// From 21st.dev / Magic UI
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MeteorsProps {
  number?: number;
  className?: string;
}

export const Meteors: React.FC<MeteorsProps> = ({ number = 20, className }) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: -5,
      left: Math.floor(Math.random() * 800) - 400 + 'px',
      animationDelay: Math.random() * 1 + 0.2 + 's',
      animationDuration: Math.floor(Math.random() * 8 + 4) + 's',
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          style={style}
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 size-0.5 rotate-[215deg] animate-meteor rounded-full bg-emerald-400 shadow-[0_0_0_1px_#ffffff10]',
            "before:absolute before:top-1/2 before:-translate-y-1/2 before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-emerald-400 before:to-transparent before:content-['']",
            className
          )}
        />
      ))}
    </>
  );
};

export default Meteors;
