---
name: Before/After Image Slider
description: Build a modern, interactive before-and-after image comparison slider without external libraries. Perfect for showcasing cleaning results, renovations, or styling changes.
---

# Before/After Image Slider Skill

This skill provides a reusable component for displaying a "Before" and "After" image comparison where the user can drag a handle to slide between the two states.

## Core Principles
1. **Interactive & Intuitive**: Must have a clear handle/dragger that users instantly recognize.
2. **Responsive**: Must work seamlessly on mobile (touch events) and desktop (mouse events).
3. **Vanilla Tech**: Built using plain HTML, CSS, and JavaScript. No bulky external libraries.
4. **Professional Design**: Smooth transitions and clean borders.

## Implementation Guide

### 1. HTML Structure

```html
<div class="comparison-slider">
  <div class="comparison-images">
    <img src="assets/after.jpg" alt="After Cleaning" class="after-image" />
    <div class="before-image-container">
      <img src="assets/before.jpg" alt="Before Cleaning" class="before-image" />
    </div>
    <div class="slider-handle">
      <svg viewBox="0 0 24 24" fill="none" class="slider-icon">
        <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M12 4v16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</div>
```

### 2. CSS Styling

```css
.comparison-slider {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  /* Use aspect-ratio to keep it consistent */
  aspect-ratio: 16 / 9;
}

.comparison-images {
  position: relative;
  width: 100%;
  height: 100%;
}

.comparison-images img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none; /* Crucial for preventing drag issues */
}

/* The before image is masked/clipped by this container */
.before-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%; /* Initial position */
  height: 100%;
  overflow: hidden;
  z-index: 2;
}

.before-image {
  width: 100vw; /* Trick to keep image size consistent inside clipped container */
  max-width: 800px; /* Match slider max-width */
}

.slider-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%; /* Initial position */
  width: 4px;
  background-color: #ffffff;
  z-index: 3;
  transform: translateX(-50%);
  cursor: ew-resize;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-handle::before {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  z-index: -1;
}

.slider-icon {
  width: 24px;
  height: 24px;
  color: #333;
}
```

### 3. JavaScript Logic

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.comparison-slider');

  sliders.forEach(slider => {
    const handle = slider.querySelector('.slider-handle');
    const beforeContainer = slider.querySelector('.before-image-container');
    const beforeImage = slider.querySelector('.before-image');
    
    // Ensure the before image maintains the exact width of the parent container
    const updateImageWidth = () => {
      beforeImage.style.width = `${slider.offsetWidth}px`;
    };
    
    window.addEventListener('resize', updateImageWidth);
    updateImageWidth();

    let isSliding = false;

    const startSlide = (e) => {
      isSliding = true;
      e.preventDefault(); // Prevent text selection/scrolling
    };

    const stopSlide = () => {
      isSliding = false;
    };

    const moveSlide = (e) => {
      if (!isSliding) return;
      
      const rect = slider.getBoundingClientRect();
      const x = (e.type.includes('mouse') ? e.pageX : e.touches[0].pageX) - rect.left - window.scrollX;
      
      // Calculate percentage
      let position = (x / rect.width) * 100;
      
      // Constrain to boundaries
      if (position < 0) position = 0;
      if (position > 100) position = 100;
      
      handle.style.left = `${position}%`;
      beforeContainer.style.width = `${position}%`;
    };

    // Mouse Events
    handle.addEventListener('mousedown', startSlide);
    window.addEventListener('mouseup', stopSlide);
    window.addEventListener('mousemove', moveSlide);

    // Touch Events
    handle.addEventListener('touchstart', startSlide, { passive: false });
    window.addEventListener('touchend', stopSlide);
    window.addEventListener('touchmove', moveSlide, { passive: false });
  });
});
```

## Usage Guidelines
- Always use high-quality, perfectly aligned Before/After images. The camera angle should be exactly the same.
- DO NOT use emojis for the slider handle, use SVG icons.
- You can change the handle color and size to match the brand identity.
