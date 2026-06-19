import { useEffect, useRef } from "react";

export function ThreeDBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Track mouse position
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Particle class representing 3D node points
    class Particle {
      x: number;
      y: number;
      z: number; // 3D depth coordinate
      vx: number;
      vy: number;
      vz: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 200 + 50; // Depth factor
        
        // Flight speed mapping to drone velocities
        const speedMultiplier = 0.45;
        this.vx = (Math.random() - 0.5) * speedMultiplier;
        this.vy = (Math.random() - 0.5) * speedMultiplier;
        this.vz = (Math.random() - 0.5) * 0.1;
        this.radius = Math.max(1, (200 - this.z) / 45); // Closer = larger
        
        // Blue to cyan spectrum (matches drone technology themes)
        const isCyan = Math.random() > 0.6;
        this.color = isCyan ? "rgba(0, 240, 255, alpha)" : "rgba(58, 134, 255, alpha)";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        // Depth bounds
        if (this.z < 50 || this.z > 250) {
          this.vz = -this.vz;
        }

        // Screen margins wrap for seamless continuous motion
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Interaction with mouse (magnetized deflection)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          // Slowly push away to mimic clean aerodynamics
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        // Calculate perspective scale alpha mapping
        const alpha = Math.max(0.05, 1 - (this.z / 250));
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color.replace("alpha", alpha.toString());
        context.fill();
        
        // Draw occasional target crosshairs mimicking HUD camera elements on 3 particles
        if (this.z < 70 && Math.floor(this.x) % 151 === 0) {
          context.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.4})`;
          context.lineWidth = 1;
          context.strokeRect(this.x - 6, this.y - 6, 12, 12);
        }
      }
    }

    // Initialize particle array
    const particlesCount = Math.min(65, Math.floor((width * height) / 22000));
    const particles: Particle[] = [];
    for (let i = 0; i < particlesCount; i++) {
      particles.push(new Particle());
    }

    // Render loop drawing nodes and spatial connect-lines
    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial dark background glow (aesthetic depth accentuation)
      const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height));
      grad.addColorStop(0, "#0E2E4E");
      grad.addColorStop(1, "#0A2540");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((part) => {
        part.update();
        part.draw(ctx);
      });

      // Draw spatial networking ties representing dynamic drone radar
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connection threshold (only connect physical objects near each other)
          if (dist < 130) {
            const zAvg = (p1.z + p2.z) / 2;
            const maxAlpha = Math.max(0.01, 1 - (zAvg / 250));
            const alpha = (1 - (dist / 130)) * 0.15 * maxAlpha;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(58, 134, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // Use ResizeObserver to monitor exact viewport boundaries accurately
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.contentRect.height;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="canvas-3d-container"
      className="fixed inset-0 w-full h-full -z-50 overflow-hidden"
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-auto" />
    </div>
  );
}
