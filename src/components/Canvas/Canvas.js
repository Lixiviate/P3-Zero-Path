import React from "react";
import useCanvas from "../../hooks/useCanvas";

const Canvas = () => {
  const canvasRef = useCanvas();

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default Canvas;