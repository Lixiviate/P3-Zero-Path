export const createRipple = (x, y, ripplesRef) => {
  ripplesRef.current.push({
    x,
    y,
    radius: 0,
    maxRadius: Math.random() * 100 + 100,
    speed: Math.random() * 1 + 0.5,
    opacity: 1,
  });
};

export const createBubble = (bubblesRef) => {
  bubblesRef.current.push({
    x: Math.random() * window.innerWidth,
    y: window.innerHeight,
    size: Math.random() * 4 + 2,
    speed: Math.random() * 2 + 1,
  });
};

export const animate = (canvasRef, ripplesRef, bubblesRef) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw ripples
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

  // Create and update bubbles
  if (Math.random() < 0.1) createBubble(bubblesRef);
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
};
