import React, { useEffect, useRef, useCallback } from "react";

const LandingPage = () => {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);
  const bubblesRef = useRef([]);
  const animationRef = useRef(null);

  const createRipple = useCallback((x, y) => {
    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: Math.random() * 100 + 100,
      speed: Math.random() * 1 + 0.5,
      opacity: 1,
    });
  }, []);

  const createBubble = useCallback(() => {
    bubblesRef.current.push({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
    });
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const time = Date.now() * 0.0005;
    const currents = [];
    for (let i = 0; i < 5; i++) {
      currents.push({
        y: (Math.sin(time + i * 0.5) * 0.5 + 0.5) * canvas.height,
        amplitude: Math.sin(time * 0.1 + i) * 10 + 20,
        wavelength: Math.sin(time * 0.02 + i * 0.3) * 80 + 150,
      });
    }

    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 2;
    currents.forEach((current) => {
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 10) {
        const y =
          current.y + Math.sin(x / current.wavelength) * current.amplitude;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    ripplesRef.current = ripplesRef.current.filter((ripple) => {
      ripple.radius += ripple.speed;
      ripple.opacity = 1 - (ripple.radius / ripple.maxRadius) ** 2;

      if (ripple.opacity <= 0) return false;

      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, 2 * Math.PI, false);
      ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      return true;
    });

    if (Math.random() < 0.1) createBubble();
    bubblesRef.current.forEach((bubble, index) => {
      bubble.y -= bubble.speed;
      if (bubble.y < -10) {
        bubblesRef.current.splice(index, 1);
      } else {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fill();
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [createBubble]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      createRipple(x, y);
    };

    canvas.addEventListener("click", handleClick);

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("click", handleClick);
    };
  }, [animate, createRipple]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-300 to-blue-500 overflow-hidden font-serif">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-white">Zero</span>
          <span className="text-teal-100">Path</span>
        </h1>
        <p className="text-2xl mb-8 text-white">
          A Tranquil Journey to Sustainability
        </p>
        <div className="bg-blue-400 bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-white">Welcome</h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white mb-1 text-left"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-300 bg-opacity-30 text-white placeholder-blue-100 border border-blue-200 border-opacity-50 focus:border-blue-400"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-1 text-left"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-300 bg-opacity-30 text-white placeholder-blue-100 border border-blue-200 border-opacity-50 focus:border-blue-400"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-6 border border-transparent rounded-full shadow-lg text-sm font-medium text-white bg-gradient-to-r from-teal-400 to-blue-400 hover:from-teal-300 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 mt-8 transition-all duration-300 ease-in-out transform hover:scale-105 glow-effect"
            >
              Begin Your Journey
            </button>
          </form>
        </div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap');
        body {
          font-family: 'Cormorant Garamond', serif;
        .glow-effect {
    box-shadow: 0 0 10px rgba(72, 191, 227, 0.4); 
    transition: box-shadow 0.3s ease;
          } 
        .glow-effect:hover {
    box-shadow: 0 0 25px rgba(72, 191, 227, 0.8), 0 0 40px rgba(72, 191, 227, 0.6); 
          }
      `}</style>
    </div>
  );
};

export default LandingPage;
