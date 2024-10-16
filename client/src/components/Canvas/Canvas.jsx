import useCanvas from "../../hooks/useCanvas";

const Canvas = () => {
  const canvasRef = useCanvas(); // Custom hook managing canvas animations

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 1 }} 
    />
  );
};

export default Canvas;