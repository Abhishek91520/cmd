"use client";
import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const maxParticles = Math.min(70, Math.floor((width * height) / 20000)); // Cap density
    const mouse = { x: null, y: null, radius: 150 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4; // Drift speed x
        this.vy = (Math.random() - 0.5) * 0.4; // Drift speed y
        this.radius = Math.random() * 2 + 1;
        this.baseAlpha = Math.random() * 0.35 + 0.15;
        this.alpha = this.baseAlpha;
      }

      update() {
        // Natural boundary bounce
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Base drift movement
        this.x += this.vx;
        this.y += this.vy;

        // Cursor attraction effect
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            // Apply a gentle force to pull particles toward cursor
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / distance) * force * 0.8;
            this.y += (dy / distance) * force * 0.8;
            this.alpha = Math.min(this.baseAlpha * 2, 0.8);
          } else {
            this.alpha = this.baseAlpha;
          }
        } else {
          this.alpha = this.baseAlpha;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`; // Indigo glow
        ctx.shadowColor = "rgba(99, 102, 241, 0.4)";
        ctx.shadowBlur = this.radius * 2;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset blur for speed
      }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Connective lines drawing (Constellation neural effect)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = (120 - dist) / 120 * 0.12;
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    // Track mouse events
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    // Window resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Re-initialize particles to prevent clipping
      particles.length = 0;
      const newMax = Math.min(70, Math.floor((width * height) / 20000));
      for (let i = 0; i < newMax; i++) {
        particles.push(new Particle());
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full bg-transparent opacity-80"
    />
  );
}
