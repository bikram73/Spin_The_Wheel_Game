import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

const Wheel = forwardRef(({ entries, backgroundImage, centerImage, selectedResult, isSpinning, onSpin }, ref) => {
  const canvasRef = useRef(null);
  const rotationRef = useRef(0);
  const animationRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const centerImageRef = useRef(null);
  const entryImagesRef = useRef({});
  const [showIntroText, setShowIntroText] = useState(true);

  // Color palette for segments - Vibrant colors matching the reference
  const colors = [
    '#FF3333', '#1E90FF', '#00CC44', '#FFD700',
    '#FF0066', '#0099FF', '#33FF00', '#FFA100',
    '#CC0033', '#005FFF', '#00EE55', '#FFCC00',
    '#FF4444', '#0077FF', '#22DD66', '#FFC700'
  ];

  // Draw the wheel
  const drawWheel = (rotation = 0) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const hasBackgroundImage = Boolean(backgroundImageRef.current);

    const drawCoverImage = (img, x, y, width, height) => {
      const imgRatio = img.width / img.height;
      const boxRatio = width / height;

      let drawWidth;
      let drawHeight;
      let offsetX;
      let offsetY;

      if (imgRatio > boxRatio) {
        drawHeight = height;
        drawWidth = height * imgRatio;
        offsetX = x - (drawWidth - width) / 2;
        offsetY = y;
      } else {
        drawWidth = width;
        drawHeight = width / imgRatio;
        offsetX = x;
        offsetY = y - (drawHeight - height) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Clear previous frame and keep card background visible.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (entries.length === 0) {
      ctx.fillStyle = '#999';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No entries', centerX, centerY);
      return;
    }

    const segmentAngle = (2 * Math.PI) / entries.length;

    // Draw wheel background image inside circle before segments.
    if (backgroundImageRef.current) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.clip();
      ctx.globalAlpha = 0.9;
      drawCoverImage(backgroundImageRef.current, centerX - radius, centerY - radius, radius * 2, radius * 2);

      // Add a subtle dark veil so labels stay readable on bright photos.
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
      ctx.restore();
    }

    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw segments
    entries.forEach((entry, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;

      // Segment
      ctx.beginPath();
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.lineTo(0, 0);
      ctx.fillStyle = hasBackgroundImage
        ? index % 2 === 0
          ? 'rgba(255, 255, 255, 0.26)'
          : 'rgba(0, 0, 0, 0.16)'
        : colors[index % colors.length];
      ctx.fill();

      // Border - bright white for segment separation
      ctx.strokeStyle = hasBackgroundImage ? 'rgba(255, 255, 255, 0.75)' : '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Text - White radial text following the segment
      ctx.save();
      ctx.rotate(startAngle + segmentAngle / 2);

      const entryImage = entryImagesRef.current[entry.id];
      if (entryImage) {
        const imageSize = Math.max(26, Math.min(44, radius * 0.16));
        const imageX = radius - imageSize - 22;
        const imageY = -imageSize / 2;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(imageX, imageY, imageSize, imageSize, 6);
        ctx.clip();
        ctx.drawImage(entryImage, imageX, imageY, imageSize, imageSize);
        ctx.restore();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(imageX, imageY, imageSize, imageSize);
      }

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      
      const text = entry.name.substring(0, 20);
      if (hasBackgroundImage) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.lineWidth = 3;
        ctx.strokeText(text, radius - 35, 0);
      }
      ctx.fillText(text, radius - 35, 0);
      ctx.restore();
    });

    // Center area supports custom center image.
    if (centerImageRef.current) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, 2 * Math.PI);
      ctx.clip();
      drawCoverImage(centerImageRef.current, -25, -25, 50, 50);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      // Center circle - White like in the reference
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.resetTransform();

    if (showIntroText) {
      // Show colorful intro text only before first spin.
      const introGradient = ctx.createLinearGradient(centerX - 85, centerY, centerX + 85, centerY);
      introGradient.addColorStop(0, '#FFD700');
      introGradient.addColorStop(0.33, '#00E5FF');
      introGradient.addColorStop(0.66, '#FF4D6D');
      introGradient.addColorStop(1, '#7CFF00');
      ctx.fillStyle = introGradient;
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 5;
      ctx.fillText('Click to spin', centerX, centerY);
    }

    // Right-side pointer only: this is the winner indicator.
    // Rotate the arrow while spinning for a dynamic effect.
    const pointerCenterX = canvas.width - 26;
    const pointerCenterY = centerY;
    const pointerSpin = isSpinning ? ((rotation * 3) % 360) : 0;

    ctx.save();
    ctx.translate(pointerCenterX, pointerCenterY);
    ctx.rotate((pointerSpin * Math.PI) / 180);

    ctx.fillStyle = '#FF3333';
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(12, -14);
    ctx.lineTo(12, 14);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#CC0000';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  // Spin animation
  useImperativeHandle(ref, () => ({
    spin: (finalAngle, duration, onComplete) => {
      const startRotation = rotationRef.current;
      const startTime = performance.now();
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const easedProgress = easeOutCubic(progress);
        
        rotationRef.current = startRotation + (finalAngle - startRotation) * easedProgress;
        drawWheel(rotationRef.current);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          rotationRef.current = finalAngle % 360;
          drawWheel(rotationRef.current);
          if (onComplete) onComplete();
        }
      };

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    }
  }));

  // Initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawWheel(rotationRef.current);
    }

    const handleResize = () => {
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawWheel(rotationRef.current);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [entries, selectedResult]);

  useEffect(() => {
    const nextImageMap = {};

    entries.forEach((entry) => {
      if (!entry.image) {
        return;
      }

      const img = new Image();
      img.onload = () => {
        entryImagesRef.current[entry.id] = img;
        drawWheel(rotationRef.current);
      };
      img.src = entry.image;
      nextImageMap[entry.id] = img;
    });

    entryImagesRef.current = nextImageMap;
    drawWheel(rotationRef.current);
  }, [entries]);

  useEffect(() => {
    if (!backgroundImage) {
      backgroundImageRef.current = null;
      drawWheel(rotationRef.current);
      return;
    }

    const img = new Image();
    img.onload = () => {
      backgroundImageRef.current = img;
      drawWheel(rotationRef.current);
    };
    img.src = backgroundImage;
  }, [backgroundImage]);

  useEffect(() => {
    if (!centerImage) {
      centerImageRef.current = null;
      drawWheel(rotationRef.current);
      return;
    }

    const img = new Image();
    img.onload = () => {
      centerImageRef.current = img;
      drawWheel(rotationRef.current);
    };
    img.src = centerImage;
  }, [centerImage]);

  const handleWheelTap = () => {
    if (showIntroText) {
      setShowIntroText(false);
    }
    if (onSpin) {
      onSpin();
    }
  };

  return (
    <div className="wheel-wrapper" onClick={handleWheelTap}>
      <canvas ref={canvasRef} className="wheel-canvas" />
    </div>
  );
});

Wheel.displayName = 'Wheel';

export default Wheel;
