import { useEffect, useRef, useCallback } from "react";
import { animate, createRipple } from "../utils/animations";

const useCanvas = () => {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);
  const bubblesRef = useRef([]);

  const handleClick = useCallback((event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    createRipple(x, y, ripplesRef);
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
    canvas.addEventListener("click", handleClick);
    animateWrapper();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("click", handleClick);
    };
  }, [handleClick]);

  return canvasRef;
};

export default useCanvas;
