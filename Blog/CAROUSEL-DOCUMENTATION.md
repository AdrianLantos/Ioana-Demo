# 3D Carousel Documentation

Welcome! This guide will help you understand how the blog carousel works. Think of this carousel like a slide show of featured blog articles, but with a cool 3D effect where you can see the current article in the center and peek at the ones on either side.

**Quick Links:**
- For a high-level overview, see [CAROUSEL-IMPLEMENTATION-SUMMARY.md](./CAROUSEL-IMPLEMENTATION-SUMMARY.md)
- For quick tips, see [CAROUSEL-QUICK-REFERENCE.md](./CAROUSEL-QUICK-REFERENCE.md)

---

## Table of Contents

1. [What is the Carousel?](#what-is-the-carousel)
2. [How It Works - The Big Picture](#how-it-works---the-big-picture)
3. [HTML Structure](#html-structure)
4. [CSS Styling](#css-styling)
5. [JavaScript Functionality](#javascript-functionality)
6. [How to Add More Slides](#how-to-add-more-slides)
7. [Troubleshooting](#troubleshooting)

---

## What is the Carousel?

The carousel is a featured article slider that shows **3 slides at once**:
- **1 slide in the center** (fully visible and in focus)
- **2 slides on the sides** (partially visible, slightly faded)

**Navigation Options (Desktop - screens > 768px):**
- Click the **arrow buttons** (← →) on the sides
- Click on the **dots** below to jump to any slide
- Click on the **side slides** themselves to move to them
- Use your **keyboard arrows** (← →)
- **Drag with your mouse** (click and drag left/right)

**Navigation Options (Mobile/Tablet - screens ≤ 768px):**
- **Horizontal scroll** with your finger (native scrolling with snap points)
- Click on the **dots** below to jump to any slide

---

## How It Works - The Big Picture

### The Three Main Parts

1. **HTML** - The structure (what slides exist and what content they have)
2. **CSS** - The styling (how slides look and where they're positioned)
3. **JavaScript** - The behavior (how slides move when you interact with them)

Think of it like building a house:
- HTML is the **blueprint** (walls, rooms, doors)
- CSS is the **decoration** (paint, furniture placement)
- JavaScript is the **automation** (automatic lights, smart thermostat)

---

## HTML Structure

### The Container Hierarchy

```
carousel-3d-section (The entire carousel area)
└── container (Centers everything on the page)
    └── carousel-3d-wrapper (Holds everything together)
        ├── carousel-3d-prev (← Previous button)
        ├── carousel-3d-next (→ Next button)
        ├── carousel-3d-container (The main viewing area)
        │   └── carousel-3d-track (Holds all the slides)
        │       ├── carousel-3d-slide (Slide 1)
        │       ├── carousel-3d-slide (Slide 2)
        │       └── carousel-3d-slide (Slide 3)
        └── carousel-3d-dots (Navigation dots)
```

### What Each Part Does

**`carousel-3d-section`**
- The outermost container
- Sets the padding and background for the entire carousel area

**`carousel-3d-wrapper`**
- Positions the navigation buttons
- Makes everything full-width

**`carousel-3d-prev` and `carousel-3d-next`**
- The arrow buttons on the left and right
- Contain SVG icons (← and →)
- Have `aria-label` for screen readers (accessibility)

**`carousel-3d-container`**
- The "viewport" - where you see the slides
- Has gradient overlays on the edges (fades out the sides)
- Fixed height on desktop, flexible on mobile

**`carousel-3d-track`**
- Holds all the individual slides
- On desktop: stacks slides on top of each other (absolute positioning)
- On mobile: lines them up in a row (horizontal scroll)

**`carousel-3d-slide`**
- Individual article cards
- Each contains:
  - **Post meta** (category badge and date)
  - **Title** (linked to the article)
  - **Excerpt** (short description)
  - **Read more link**

**`carousel-3d-dots`**
- Container for the dot navigation
- Dots are created dynamically by JavaScript (one dot per slide)

### Example of a Single Slide

```html
<article class="carousel-3d-slide active" data-index="0">
    <div class="carousel-3d-content">
        <!-- Category and date -->
        <div class="post-meta">
            <span class="post-category">Drept Penal</span>
            <span class="post-date">5 Decembrie 2025</span>
        </div>

        <!-- Article title -->
        <h2 class="featured-title">
            <a href="./featured-article.html">Article Title Here</a>
        </h2>

        <!-- Short description -->
        <p class="featured-excerpt">
            This is a short preview of what the article is about...
        </p>

        <!-- Link to read the full article -->
        <a href="./featured-article.html" class="read-more">Citește articolul</a>
    </div>
</article>
```

**Key attributes:**
- `data-index="0"` - Identifies which slide this is (0 for first, 1 for second, etc.)
- `class="active"` - This class marks the currently visible slide

---

## CSS Styling

### The 3D Effect - How Slides Are Positioned

CSS uses different **classes** to position slides:

#### 1. **Active Slide** (`.active`)
```css
.carousel-3d-slide.active {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    filter: blur(0px);
    pointer-events: all;
    z-index: 2;
}
```

**What this does:**
- `translate(-50%, -50%)` - Centers the slide perfectly
- `scale(1)` - Normal size (100%)
- `opacity: 1` - Fully visible (not transparent at all)
- `filter: blur(0px)` - No blur (crystal clear)
- `pointer-events: all` - Fully interactive (you can click on links)
- `z-index: 2` - Appears on top of other slides

**Think of it like:** The main actor on stage under a spotlight

#### 2. **Previous Slide** (`.prev`)
```css
.carousel-3d-slide.prev {
    transform: translate(calc(-50% - 55%), -50%) scale(0.85);
    opacity: 0.6;
    filter: blur(1.5px);
    pointer-events: none;
    z-index: 1;
}
```

**What this does:**
- `translate(calc(-50% - 55%), -50%)` - Moves 55% to the **left**
- `scale(0.85)` - Shrinks to 85% of normal size
- `opacity: 0.6` - 60% visible (40% transparent)
- `filter: blur(1.5px)` - Applies a subtle blur effect (desktop only)
- `pointer-events: none` - You can't click on it
- `z-index: 1` - Appears behind the active slide

**Think of it like:** A backup actor waiting in the wings (stage left), slightly out of focus

#### 3. **Next Slide** (`.next`)
```css
.carousel-3d-slide.next {
    transform: translate(calc(-50% + 55%), -50%) scale(0.85);
    opacity: 0.6;
    filter: blur(1.5px);
    pointer-events: none;
    z-index: 1;
}
```

**What this does:**
- `translate(calc(-50% + 55%), -50%)` - Moves 55% to the **right**
- Same size, opacity, blur, and z-index as `.prev`
- `pointer-events: none` - You can't click on it

**Think of it like:** Another backup actor waiting in the wings (stage right), slightly out of focus

#### 4. **Hidden Slides** (`.hidden`)
```css
.carousel-3d-slide.hidden {
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(0.7);
}
```

**What this does:**
- `opacity: 0` - Completely invisible
- `pointer-events: none` - You can't click on it
- `scale(0.7)` - Shrunk down (even though you can't see it)

**Think of it like:** Actors backstage who aren't in this scene

### The Gradient Fade Effect

```css
.carousel-3d-container::before,
.carousel-3d-container::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 30%;
    pointer-events: none;
    z-index: 3;
}

.carousel-3d-container::before {
    left: 0;
    background: linear-gradient(90deg,
        rgba(255,255,255,1) 0%,
        rgba(255,255,255,0.8) 20%,
        rgba(255,255,255,0) 100%);
}

.carousel-3d-container::after {
    right: 0;
    background: linear-gradient(270deg,
        rgba(255,255,255,1) 0%,
        rgba(255,255,255,0.8) 20%,
        rgba(255,255,255,0) 100%);
}
```

**What this does:**
- Creates two invisible overlay elements (`:before` and `:after`)
- `:before` covers the **left 30%** with a white-to-transparent gradient
- `:after` covers the **right 30%** with a white-to-transparent gradient
- `z-index: 3` - Appears on top of the slides but below navigation buttons
- `pointer-events: none` - You can still click through them

**Why use gradients?**
- Helps separate the active slide from the side slides
- Works together with the blur effect for better text readability
- Creates depth and focus on the center content

**Think of it like:** Fog machines on the sides of the stage that gradually fade the view

### Z-Index Layering Strategy

The carousel uses a consistent z-index system to ensure elements appear in the correct order:

```
Layer 10: Navigation buttons (z-index: 10)
Layer 10: Dots (z-index: 10)
Layer 3:  Gradient overlays (z-index: 3)
Layer 2:  Active slide (z-index: 2)
Layer 1:  Prev/Next slides (z-index: 1)
Layer 0:  Hidden slides (z-index: 0)
```

**Why this matters:**
- Active slide appears on top of prev/next slides
- Gradients appear on top of all slides
- Navigation buttons and dots appear on top of everything
- **Z-index stays consistent during transitions** (prevents slides from "jumping" into view)

**Previous issue (now fixed):**
- Initially, z-index changed during transitions
- New active slide would appear before moving into position
- This caused it to be cut off by overflow
- **Solution:** Keep z-index stable, use CSS transitions for smooth movement

### Responsive Design

#### Desktop (screens wider than 768px)
- Carousel is 550px tall
- Shows the 3D effect (center + 2 sides)
- **Blur effect on inactive slides** (1.5px blur)
- Navigation buttons are visible
- Mouse drag and keyboard navigation work
- Side slides have `pointer-events: none`

#### Tablet (768px - 1024px)
- Carousel is 500px tall
- Slightly smaller buttons and padding
- Still shows 3D effect
- **Blur effect still active**

#### Mobile (less than 768px)
- Carousel becomes a **horizontal scroll**
- No fixed height (adapts to content)
- Navigation buttons hidden
- Dots remain visible with **large touch targets (44x44px)**
- Native touch scrolling with snap points
- Each slide is 85% of screen width
- **No blur effects** (all slides are clear)
- **No 3D positioning** (slides are in a row)
- All slides have `pointer-events: all`

**Why different on mobile?**
- Touch devices work better with native scrolling
- Smaller screens need more space efficiency
- Snap points make it feel deliberate, not accidental
- No blur improves performance and readability on small screens
- Larger touch targets ensure easier navigation

### Fluid Typography (clamp function)

```css
font-size: clamp(24px, 3.5vw, 48px);
```

**How to read this:**
- **24px** - Minimum size (on very small screens)
- **3.5vw** - Preferred size (3.5% of viewport width)
- **48px** - Maximum size (on very large screens)

**Think of it like:** A rubber band that stretches and shrinks within limits

**Benefits:**
- Looks good on all screen sizes
- Smooth scaling (not jumpy)
- No need for multiple media queries

---

## JavaScript Functionality

### Variables (Global State)

```javascript
let currentSlideIndex = 0;
let isCarouselTransitioning = false;
```

**What each variable does:**

- **`currentSlideIndex`** - Which slide is currently active (0 = first, 1 = second, etc.)
- **`isCarouselTransitioning`** - Prevents spam-clicking during animation (true/false flag)

**Think of it like:** The carousel's memory - it remembers what slide you're on and if it's currently moving

### Main Function: `initialize3DCarousel()`

This function runs when the page loads and sets up everything.

```javascript
function initialize3DCarousel() {
    // 1. Get all the HTML elements we need
    const slides = document.querySelectorAll('.carousel-3d-slide');
    const dotsContainer = document.querySelector('.carousel-3d-dots');
    const prevBtn = document.querySelector('.carousel-3d-prev');
    const nextBtn = document.querySelector('.carousel-3d-next');
    const carouselContainer = document.querySelector('.carousel-3d-container');

    // 2. If no slides exist, stop here
    if (slides.length === 0) return;

    // 3. Create navigation dots
    // 4. Set up click handlers on slides
    // 5. Set up button click handlers
    // 6. Set up mouse drag support (desktop only, >768px)
    // 7. Set up keyboard navigation
    // 8. Initialize the first slide
}
```

#### Step-by-Step Breakdown

**Step 1: Get HTML Elements**
```javascript
const slides = document.querySelectorAll('.carousel-3d-slide');
```
- `document.querySelectorAll()` finds ALL elements with the class `.carousel-3d-slide`
- Returns a list (like an array) of all slides
- `const` means this variable won't change

**Think of it like:** Making a list of all the actors in your play

**Step 2: Safety Check**
```javascript
if (slides.length === 0) return;
```
- `slides.length` tells us how many slides exist
- If there are 0 slides, `return` exits the function early
- Prevents errors from trying to work with slides that don't exist

**Think of it like:** Checking if you have actors before starting the play

**Step 3: Dynamically Create Dots**
```javascript
if (dotsContainer) {
    dotsContainer.innerHTML = '';  // Clear any existing dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-3d-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('data-index', index);
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide3D(index));
        dotsContainer.appendChild(dot);
    });
}
```

**What's happening:**
1. Clear the dots container
2. Loop through each slide (we don't need the slide itself, just the index)
3. For each slide, create a button element
4. Add the class `carousel-3d-dot`
5. If it's the first slide (index 0), also add the `active` class
6. Set attributes for accessibility and identification
7. Add a click event listener that jumps to that slide
8. Add the dot to the container

**Think of it like:** Creating a remote control with one button for each slide

**Step 4: Click on Slides**
```javascript
slides.forEach((slide, index) => {
    slide.addEventListener('click', function (e) {
        if (e.target.tagName === 'A' || e.target.closest('a')) return;

        const slideClass = this.className;
        if (slideClass.includes('next')) {
            rotate3DCarousel(1);
        } else if (slideClass.includes('prev')) {
            rotate3DCarousel(-1);
        }
    });
});
```

**What's happening:**
1. Loop through each slide
2. Add a click event listener
3. If you clicked on a link, do nothing (let the link work normally)
4. Check if the clicked slide has class `next` → move forward
5. Check if the clicked slide has class `prev` → move backward

**Think of it like:** Tapping a backup actor to bring them center stage

**Step 5: Navigation Button Handlers**
```javascript
if (prevBtn) {
    prevBtn.addEventListener('click', () => rotate3DCarousel(-1));
}
if (nextBtn) {
    nextBtn.addEventListener('click', () => rotate3DCarousel(1));
}
```

**What's happening:**
- If the previous button exists, clicking it rotates backward (-1)
- If the next button exists, clicking it rotates forward (+1)

**Step 6: Mouse Drag (Desktop Only)**
This detects when you click and drag with your mouse on desktop screens (>768px).

**The logic:**
1. **On mouse down:** Remember the starting X position and change cursor to "grabbing"
2. **On mouse move:** Update the current X position while dragging
3. **On mouse up:**
   - Calculate the difference between start and end
   - If you moved more than 50 pixels:
     - Dragged left → go to next slide
     - Dragged right → go to previous slide
   - Change cursor back to "grab"
4. **On mouse leave:** Cancel drag if mouse leaves the carousel area

**Important:** This only works on screens wider than 768px. Mobile uses native scroll instead.

**Think of it like:** Swiping through photos on your desktop

**Step 7: Keyboard Navigation**
```javascript
document.addEventListener('keydown', handleCarouselKeyboard);

function handleCarouselKeyboard(e) {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        rotate3DCarousel(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        rotate3DCarousel(1);
    }
}
```

**What's happening:**
- Listen for any key press
- If it's the left arrow → go to previous slide
- If it's the right arrow → go to next slide
- `e.preventDefault()` stops the browser from scrolling the page

### Navigation Function: `rotate3DCarousel(direction)`

This is the main function that moves slides.

```javascript
function rotate3DCarousel(direction) {
    // 1. Check if we're already transitioning
    if (isCarouselTransitioning) return;

    // 2. Get all slides
    const slides = document.querySelectorAll('.carousel-3d-slide');
    const totalSlides = slides.length;

    // 3. Set the transition lock
    isCarouselTransitioning = true;

    // 4. Calculate the new slide index
    currentSlideIndex = (currentSlideIndex + direction + totalSlides) % totalSlides;

    // 5. Update which slides are visible
    update3DSlides();

    // 6. Release the lock after animation finishes
    setTimeout(() => {
        isCarouselTransitioning = false;
    }, 700);
}
```

#### Understanding the Math

**The problem:** We need to wrap around (after the last slide, go to the first; before the first, go to the last)

**The solution:** Modulo operator `%`

```javascript
currentSlideIndex = (currentSlideIndex + direction + totalSlides) % totalSlides;
```

**Let's say we have 3 slides (indices 0, 1, 2):**

**Example 1: Moving forward from slide 2**
- `currentSlideIndex = 2`
- `direction = 1` (forward)
- `totalSlides = 3`
- Calculation: `(2 + 1 + 3) % 3 = 6 % 3 = 0`
- Result: We wrap around to slide 0 ✓

**Example 2: Moving backward from slide 0**
- `currentSlideIndex = 0`
- `direction = -1` (backward)
- `totalSlides = 3`
- Calculation: `(0 + (-1) + 3) % 3 = 2 % 3 = 2`
- Result: We wrap around to slide 2 ✓

**Why add `totalSlides`?**
- In JavaScript, `-1 % 3 = -1` (not 2!)
- Adding `totalSlides` ensures we never get negative numbers
- The modulo then wraps it correctly

**Think of it like:** A circular clock - after 12 comes 1, before 1 comes 12

### Update Function: `update3DSlides()`

This function applies the correct CSS classes to show/hide slides.

```javascript
function update3DSlides() {
    const slides = document.querySelectorAll('.carousel-3d-slide');
    const dots = document.querySelectorAll('.carousel-3d-dot');
    const totalSlides = slides.length;

    // 1. Remove all positioning classes from all slides
    slides.forEach(slide => {
        slide.classList.remove('active', 'prev', 'next', 'hidden');
    });

    // 2. Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // 3. Calculate which slides should be prev/next
    const prevIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    const nextIndex = (currentSlideIndex + 1) % totalSlides;

    // 4. Apply the correct classes
    slides[currentSlideIndex].classList.add('active');
    slides[prevIndex].classList.add('prev');
    slides[nextIndex].classList.add('next');

    // 5. Hide all other slides (if more than 3 exist)
    if (totalSlides > 3) {
        slides.forEach((slide, index) => {
            if (index !== currentSlideIndex &&
                index !== prevIndex &&
                index !== nextIndex) {
                slide.classList.add('hidden');
            }
        });
    }

    // 6. Mark the current dot as active
    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.add('active');
    }
}
```

**Step-by-step:**

1. **Clean slate** - Remove all positioning classes so we can reassign them
2. **Reset dots** - Remove active state from all dots
3. **Calculate neighbors** - Figure out which slides are before and after the current one
4. **Assign positions** - Give each slide its role (active, prev, next)
5. **Hide extras** - If you have more than 3 slides, hide the ones that aren't visible
6. **Update indicator** - Mark the current dot as active

**Think of it like:** Rearranging actors on stage for each scene

### Transition Lock: Why It Matters

```javascript
let isCarouselTransitioning = false;

function rotate3DCarousel(direction) {
    if (isCarouselTransitioning) return;
    isCarouselTransitioning = true;
    // ... do the rotation ...
    setTimeout(() => {
        isCarouselTransitioning = false;
    }, 700);
}
```

**The problem without it:**
- User clicks next button 5 times rapidly
- Carousel tries to transition 5 times at once
- Slides jump around chaotically
- Looks broken

**The solution:**
- Set flag to `true` when starting a transition
- If flag is `true`, ignore any new requests
- After 700ms (animation duration), set flag back to `false`
- Now ready for the next transition

**Think of it like:** A "Do Not Disturb" sign on a door while you're changing clothes

---

## How to Add More Slides

Adding slides is easy! Just copy an existing slide and change the content.

### Step 1: Copy a Slide

Find this section in `index.html`:

```html
<div class="carousel-3d-track">
    <!-- Existing slides here -->
</div>
```

### Step 2: Paste a New Slide

Add a new slide **before** the closing `</div>`:

```html
<!-- Slide 4 - NEW -->
<article class="carousel-3d-slide" data-index="3">
    <div class="carousel-3d-content">
        <div class="post-meta">
            <span class="post-category">Your Category</span>
            <span class="post-date">Your Date</span>
        </div>
        <h2 class="featured-title">
            <a href="./your-article.html">Your Article Title</a>
        </h2>
        <p class="featured-excerpt">
            Your article description goes here...
        </p>
        <a href="./your-article.html" class="read-more">Citește articolul</a>
    </div>
</article>
```

### Step 3: Update the Content

- **Category**: Change to match your article (Drept Penal, Drept Civil, etc.)
- **Date**: Update to your article's date
- **Title**: Your article's title
- **Link**: Path to your article page
- **Excerpt**: A short preview (2-3 sentences)

### Step 4: Update the `data-index`

**Important:** Each slide needs a unique index starting from 0.

- First slide: `data-index="0"`
- Second slide: `data-index="1"`
- Third slide: `data-index="2"`
- Fourth slide: `data-index="3"`
- And so on...

### Step 5: Remove Classes (Except on First Slide)

**Remove these classes from new slides:**
- `active`
- `prev`
- `next`

**Only the first slide should have:** `class="carousel-3d-slide active"`

**All other slides should have:** `class="carousel-3d-slide"`

### Step 6: Save and Test

That's it! The JavaScript will automatically:
- Create the correct number of dots
- Handle navigation with any number of slides
- Manage the 3D positioning

**You don't need to touch the CSS or JavaScript!**

---

## Troubleshooting

### Problem: Slides Don't Move

**Possible causes:**

1. **JavaScript not loaded**
   - Check browser console for errors (F12 → Console)
   - Make sure `blog.js` is included: `<script src="./blog.js"></script>`

2. **Duplicate IDs**
   - Each slide should have a unique `data-index`
   - No two slides should have the same index

3. **Missing classes**
   - First slide needs `class="carousel-3d-slide active"`
   - Other slides need `class="carousel-3d-slide"`

### Problem: Slides Look Wrong / Overlapping

**Possible causes:**

1. **Missing CSS**
   - Make sure `blog.css` is included: `<link rel="stylesheet" href="./blog.css">`

2. **CSS cache**
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

3. **Conflicting styles**
   - Check if other CSS is overriding carousel styles
   - Use browser dev tools to inspect elements

### Problem: Navigation Buttons Don't Appear

**Possible causes:**

1. **Buttons missing from HTML**
   - Make sure both buttons are inside `carousel-3d-wrapper`
   - Check that they have the correct classes: `carousel-3d-prev` and `carousel-3d-next`

2. **Mobile view**
   - Buttons are hidden on screens smaller than 768px (this is intentional)
   - Try resizing your browser window to be wider

### Problem: Dots Don't Show Up

**Check these:**

1. The dots container exists: `<div class="carousel-3d-dots"></div>`
2. It's inside the `carousel-3d-wrapper`
3. JavaScript has run (dots are created by JS, not HTML)

### Problem: Dots Don't Work on Mobile

**If dots are visible but not clickable on mobile:**

1. **Check z-index:** Dots should have `z-index: 10` in CSS
2. **Touch targets:** Mobile dots use a `::before` pseudo-element to create larger touch areas (44x44px minimum)
3. **Clear browser cache:** Hard refresh with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**This is implemented in the CSS:**
```css
.carousel-3d-dot::before {
    content: '';
    position: absolute;
    top: -12px;
    left: -12px;
    right: -12px;
    bottom: -12px;
    /* Creates a 44x44px touch target */
}
```

### Problem: Can't Swipe on Mobile

**This is actually correct!**
- On mobile/tablet (≤ 768px), the carousel uses **native horizontal scroll** instead of JavaScript swipe handlers
- You should be able to **scroll horizontally** with your finger
- The slides snap into place when you stop scrolling (scroll-snap-type)
- Dots still work for navigation

**Why native scroll instead of JavaScript?**
- Better performance on mobile devices
- Smoother scrolling experience
- Works with browser's built-in optimizations
- More familiar to mobile users

---

## Summary

### Key Concepts

1. **HTML** provides the structure (slides and containers)
2. **CSS** handles positioning and animations with classes
3. **JavaScript** manages state and updates classes based on user interaction
4. **Classes** (`.active`, `.prev`, `.next`, `.hidden`) control which slides are visible
5. **Transitions** in CSS make the movement smooth (0.7 seconds)
6. **The modulo operator** (`%`) enables infinite wrapping in both directions
7. **Responsive design** adapts the carousel for different screen sizes

### The Flow of a Click

1. User clicks the "next" button
2. JavaScript checks if a transition is already happening (if yes, stop)
3. Calculate the new slide index using modulo math
4. Remove all positioning classes from all slides
5. Add the correct classes to the new active, prev, and next slides
6. CSS automatically animates the transitions
7. After 700ms, unlock the carousel for the next interaction

### Tips for Customization

**To change animation speed:**
- Update the CSS transition: `transition: transform 0.7s ...`
- Update the JavaScript timeout: `setTimeout(() => {...}, 700)`
- Keep these values the same!

**To change how much of side slides is visible:**
- Adjust the gradient width: `.carousel-3d-container::before { width: 30%; }`
- Adjust the slide offset: `transform: translate(calc(-50% + 55%), ...)`

**To change the scale of side slides:**
- Update CSS variable: `--carousel-3d-scale-side: 0.85;`

**To change the fade of side slides:**
- Update CSS variable: `--carousel-3d-opacity-side: 0.6;`

**To change the blur effect on side slides:**
- Update the blur amount: `.carousel-3d-slide.prev { filter: blur(1.5px); }`
- Use `blur(0px)` to remove blur entirely
- Higher values = more blur (e.g., `blur(3px)`)

**To adjust mobile dot touch targets:**
- Change the `::before` sizing on `.carousel-3d-dot`
- Current: 12px padding on all sides = 44x44px touch area
- Minimum recommended: 44x44px for good mobile UX

---

## Further Learning

If you want to learn more about the technologies used:

- **HTML**: [MDN HTML Guide](https://developer.mozilla.org/en-US/docs/Web/HTML)
- **CSS Transforms**: [MDN Transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- **CSS Transitions**: [MDN Transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition)
- **JavaScript Events**: [MDN Events](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)
- **JavaScript Arrays**: [MDN Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

---

**Happy coding! 🎉**
