---
name: Service Business Landing Page
description: Build beautiful, conversion-optimized landing pages for service businesses (salons, clinics, restaurants, cleaning, etc.) with a proven section structure and modern design patterns.
---

# Service Business Landing Page Skill

## Overview
Proven, reusable template for building LPs for any service-based business. Optimized for conversions while maintaining a premium look.

## Universal Section Structure

```
1. Hero          → First impression + primary CTA
2. Values/About  → Why choose this business
3. Services/Menu → What they offer (with pricing)
4. Gallery       → Visual proof (photos, before/after)
5. Testimonials  → Social proof (reviews)
6. Booking/CTA   → How to book (form, embed, or link)
7. Access/Info   → Location, hours, parking
8. Footer        → Copyright, social links, legal
```

## Design System (CSS Variables)

```css
:root {
  /* Brand Colors - CHANGE PER PROJECT */
  --color-primary: #3E5C4A;
  --color-primary-dark: #2D4537;
  --color-primary-light: #5A7D66;
  --color-primary-rgb: 62, 92, 74;
  --color-background: #FDFDFB;
  --color-surface: #FFFFFF;
  --color-text: #2C3E50;
  --color-text-light: #6B7B8D;
  --color-accent: #D4AF37;

  /* Typography */
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', 'Noto Sans JP', sans-serif;

  /* Spacing */
  --section-padding: clamp(4rem, 8vw, 8rem);
  --container-width: 1200px;
  --container-padding: clamp(1rem, 4vw, 2rem);

  /* Effects */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 30px rgba(0,0,0,0.12);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --transition: 0.3s ease;
}
```

## Section Templates

See `sections/` directory for full HTML+CSS templates of each section:
- `sections/hero.md` - Full-viewport hero with overlay
- `sections/values.md` - 3-column value cards
- `sections/menu.md` - Tabbed service menu with pricing
- `sections/gallery.md` - Photo grid with hover zoom
- `sections/booking.md` - Booking embed or CTA
- `sections/access.md` - Google Maps + business info
- `sections/navbar.md` - Sticky responsive navigation
- `sections/footer.md` - Footer with social links
- `sections/animations.md` - Scroll reveal effects

## Key Patterns

### Buttons
```css
.btn {
  display: inline-flex; align-items: center;
  padding: 0.9rem 2rem; border-radius: var(--radius-sm);
  font-size: 1rem; font-weight: 600; text-decoration: none;
  transition: var(--transition); cursor: pointer; border: 2px solid transparent;
}
.btn-primary { background: var(--color-primary); color: white; border-color: var(--color-primary); }
.btn-primary:hover { background: var(--color-primary-dark); transform: translateY(-2px); box-shadow: var(--shadow-md); }
.btn-outline { background: transparent; color: white; border-color: white; }
.btn-outline:hover { background: white; color: var(--color-primary); }
```

### Responsive Grid
```css
.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
@media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }
```

### Scroll Reveal
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

## Performance Checklist
- [ ] Images: WebP, `loading="lazy"`, responsive srcset
- [ ] Fonts: Preload, `font-display: swap`
- [ ] CSS/JS: Minified in production
- [ ] Google Maps: Lazy load with intersection observer
- [ ] Meta tags: title, description, OGP for social sharing

## Implementation Steps
1. Read project's site_data.md for brand info
2. Customize CSS variables to match brand
3. Build sections in order: Hero → Values → Menu → Gallery → Booking → Access
4. Add sticky navigation + mobile hamburger
5. Add scroll animations
6. Optimize and test responsive layout
7. Combine with i18n skill if bilingual needed
8. Combine with Contact Form skill if inquiry form needed

---

This skill is the foundation for any service business website.
