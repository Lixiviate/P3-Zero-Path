import { useEffect, useRef, useCallback } from "react";
import { animate, createRipple } from "../utils/animations";

const useCanvas = (enableRipples = false) => {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);
  const bubblesRef = useRef([]);

  const handleClick = useCallback((event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    createRipple(x, y, ripplesRef); // Add ripple animation on click
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animateWrapper = () => {
      animationId = requestAnimationFrame(animateWrapper);
      animate(canvasRef, ripplesRef, bubblesRef);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (enableRipples) {
      canvas.addEventListener("click", handleClick);
    }

    animateWrapper();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      if (enableRipples) {
        canvas.removeEventListener("click", handleClick);
      }
    };
  }, [handleClick, enableRipples]);

  return canvasRef;
};

export default useCanvas;
