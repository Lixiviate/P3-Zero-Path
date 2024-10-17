import useCanvas from "../../hooks/useCanvas";

const Canvas = ({ enableRipples = true }) => {
  const canvasRef = useCanvas(enableRipples);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default Canvas;
