import useCanvas from "../../hooks/useCanvas";
import PropTypes from 'prop-types';

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

Canvas.propTypes = {
  enableRipples: PropTypes.bool
};

export default Canvas;
