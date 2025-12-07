# Carousel Quick Reference

**For detailed explanations, see [CAROUSEL-DOCUMENTATION.md](./CAROUSEL-DOCUMENTATION.md)**
**For implementation overview, see [CAROUSEL-IMPLEMENTATION-SUMMARY.md](./CAROUSEL-IMPLEMENTATION-SUMMARY.md)**

## File Structure

```
Blog/
├── index.html                      # HTML structure with carousel slides
├── blog.css                        # Carousel styling (lines 43-407)
├── blog.js                         # Carousel functionality (lines 107-362)
├── CAROUSEL-DOCUMENTATION.md       # Full documentation (explains everything in detail)
├── CAROUSEL-QUICK-REFERENCE.md     # This file (quick tips and code locations)
└── CAROUSEL-IMPLEMENTATION-SUMMARY.md  # Implementation overview and architecture
```

## Navigation Methods

| Method | Desktop | Mobile | How It Works |
|--------|---------|--------|--------------|
| **Arrow Buttons** | ✅ Yes | ❌ No | Click ← or → buttons |
| **Dot Navigation** | ✅ Yes | ✅ Yes | Click any dot to jump to that slide (44x44px touch targets on mobile) |
| **Click Slides** | ✅ Yes | ❌ No | Click partially visible slides to navigate |
| **Keyboard** | ✅ Yes | ❌ No | Use ← → arrow keys |
| **Mouse Drag** | ✅ Yes | ❌ No | Click and drag left/right (>768px only) |
| **Native Scroll** | ❌ No | ✅ Yes | Scroll horizontally with snap points |

## How to Add a New Slide

1. **Copy** an existing slide in [index.html](./index.html)
2. **Update** these attributes:
   - `data-index="3"` (increment the number)
   - Remove `active` class (only first slide has it)
3. **Change** the content:
   - Category (Drept Penal, etc.)
   - Date
   - Title & link
   - Excerpt text
4. **Save** - JavaScript handles the rest!

### Example

```html
<article class="carousel-3d-slide" data-index="3">
    <div class="carousel-3d-content">
        <div class="post-meta">
            <span class="post-category">Your Category</span>
            <span class="post-date">Your Date</span>
        </div>
        <h2 class="featured-title">
            <a href="./your-link.html">Your Title</a>
        </h2>
        <p class="featured-excerpt">
            Your excerpt here...
        </p>
        <a href="./your-link.html" class="read-more">Citește articolul</a>
    </div>
</article>
```

## Customization Cheat Sheet

### Change Animation Speed

**CSS** ([blog.css](./blog.css)):
```css
.carousel-3d-slide {
    transition: transform 0.7s ..., opacity 0.7s ...;
}
```

**JavaScript** ([blog.js](./blog.js)):
```javascript
setTimeout(() => {
    isCarouselTransitioning = false;
}, 700); // Match CSS value!
```

### Change Side Slide Scale

**CSS** (in `:root` variables):
```css
:root {
    --carousel-3d-scale-side: 0.85; /* 85% size */
    --carousel-3d-opacity-side: 0.6; /* 60% opacity */
}
```

### Change Gradient Width

**CSS**:
```css
.carousel-3d-container::before,
.carousel-3d-container::after {
    width: 30%; /* Fade covers 30% of edges */
}
```

### Change Slide Offset

**CSS** (how far left/right side slides are):
```css
.carousel-3d-slide.prev {
    transform: translate(calc(-50% - 55%), -50%) ... ;
    /* Change 55% to move further/closer */
}
```

### Change Blur Effect

**CSS** (blur amount on side slides):
```css
.carousel-3d-slide.prev,
.carousel-3d-slide.next {
    filter: blur(1.5px); /* Adjust blur amount */
}

.carousel-3d-slide.active {
    filter: blur(0px); /* No blur on active slide */
}
```
**Note:** Blur is automatically disabled on mobile (≤768px) for better performance.

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| **Desktop** | > 1024px | Full 3D effect, 550px height, all navigation |
| **Tablet** | 768px - 1024px | 3D effect, 500px height, smaller buttons |
| **Mobile** | < 768px | Horizontal scroll, auto height, no buttons |
| **Small Mobile** | < 480px | Wider slides (90vw), smaller dots |

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| **Slides don't move** | Check browser console (F12) for errors |
| **Buttons missing** | Are you on mobile? (<768px = hidden by design) |
| **Slides overlap** | Hard refresh: Ctrl+Shift+R |
| **Wrong number of dots** | Check each slide has unique `data-index` |
| **Dots don't work on mobile** | Check z-index: 10 on dots, clear cache |
| **Can't swipe on mobile** | That's correct! Use horizontal scroll instead (native scroll with snap points) |

## Key Code Sections

### HTML ([index.html](./index.html))
- **Lines 45-148**: Entire carousel section
- **Lines 79-127**: Individual slides
- **Lines 142-145**: Dot container

### CSS ([blog.css](./blog.css))
- **Lines 46-93**: Main carousel structure
- **Lines 95-136**: Slide positioning (.active, .prev, .next, .hidden)
- **Lines 138-175**: Navigation buttons
- **Lines 177-197**: Gradient overlays
- **Lines 205-233**: Dot navigation
- **Lines 235-257**: Tablet responsive
- **Lines 260-332**: Mobile responsive
- **Lines 334-365**: Small mobile responsive

### JavaScript ([blog.js](./blog.js))
- **Lines 111-113**: Global state variables (currentSlideIndex, isCarouselTransitioning)
- **Lines 120-229**: Initialization (setup all event listeners, create dots)
- **Lines 174-222**: Mouse drag handler (desktop only, >768px)
- **Lines 239-250**: Keyboard navigation
- **Lines 260-282**: Navigation functions (rotate3DCarousel)
- **Lines 288-300**: Jump to slide function (goToSlide3D)
- **Lines 310-355**: Update function (applies CSS classes)

## Important Notes

✅ **Do's:**
- Keep `data-index` unique and sequential (0, 1, 2, ...)
- Match CSS and JS transition durations (both 700ms)
- Only first slide should have `class="active"`
- Read the full documentation for explanations

❌ **Don'ts:**
- Don't skip index numbers (0, 1, 3 is wrong - should be 0, 1, 2, 3)
- Don't add `prev` or `next` classes manually (JS handles this)
- Don't change transition duration without updating both CSS and JS
- Don't modify the dots HTML (they're created by JavaScript)

## CSS Classes Explained

| Class | Purpose | Applied By |
|-------|---------|------------|
| `.active` | Center slide, full size, fully visible, no blur, clickable (z-index: 2) | JavaScript |
| `.prev` | Left slide, smaller, faded, blurred (1.5px), not clickable (z-index: 1) | JavaScript |
| `.next` | Right slide, smaller, faded, blurred (1.5px), not clickable (z-index: 1) | JavaScript |
| `.hidden` | Hidden slide (when more than 3 exist, z-index: 0) | JavaScript |
| `.transitioning` | Optional, during animation | (Unused currently) |

## Need More Help?

1. **Read the implementation summary**: [CAROUSEL-IMPLEMENTATION-SUMMARY.md](./CAROUSEL-IMPLEMENTATION-SUMMARY.md) - High-level overview and architecture
2. **Read the full documentation**: [CAROUSEL-DOCUMENTATION.md](./CAROUSEL-DOCUMENTATION.md) - Detailed explanations for beginners
3. **Check the code comments**: All files have detailed inline comments
4. **Use browser dev tools**: F12 → Console for errors, Elements to inspect

---

**Last Updated**: December 2025
**Tested On**: Chrome, Firefox, Safari, Edge (latest versions)
**Responsive**: Desktop, Tablet, Mobile
