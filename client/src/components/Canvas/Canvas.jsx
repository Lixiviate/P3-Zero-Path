import useCanvas from "../../hooks/useCanvas";

const Canvas = () => {
  const canvasRef = useCanvas(); // Custom hook managing canvas animations

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ zIndex: 0 }}
    />
  );
};

export default Canvas;
