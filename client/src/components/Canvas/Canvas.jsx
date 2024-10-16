import useCanvas from "../../hooks/useCanvas";

const Canvas = ({ enableRipples = true }) => {
  const canvasRef = useCanvas(enableRipples);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
};

export default Canvas;
