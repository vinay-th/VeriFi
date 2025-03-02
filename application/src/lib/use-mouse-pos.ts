import { useState, useEffect } from 'react';

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Use direct DOM manipulation for better performance
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return;

      const rect = heroSection.getBoundingClientRect();

      // Update state directly without RAF
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    // Use passive event listener for better performance
    window.addEventListener('mousemove', updateMousePosition, {
      passive: true,
    });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
