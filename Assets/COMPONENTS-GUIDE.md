# Navigation & Footer Components Guide

## Overview

Instead of duplicating navigation and footer HTML across every page, use the shared `components.js` file to load them automatically.

## How to Use

### For any HTML page:

1. **Remove** the hardcoded `<nav>` and `<footer>` from HTML
2. **Add** the components script **before** closing `</body>` tag:

```html
<!DOCTYPE html>
<html lang="ro">
<head>
    <!-- head content -->
    <link rel="stylesheet" href="./Assets/general.css">
    <link rel="stylesheet" href="./Assets/style.css">
</head>
<body>
    <!-- Navigation will load here automatically -->

    <main>
        <!-- page content -->
    </main>

    <!-- Footer will load here automatically -->

    <!-- Load components BEFORE other scripts -->
    <script src="./Assets/components.js"></script>
    <script src="./Assets/general.js"></script>
    <script src="./Assets/script.js"></script>
</body>
</html>
```

### Path Handling

The script automatically adjusts paths based on page depth:

- **Root level** (`/index.html`) → Uses `./Assets/`
- **One level deep** (`/Blog/index.html`) → Uses `../Assets/`
- **Two levels deep** (`/Blog/Posts/article.html`) → Uses `../../Assets/`

**No manual path adjustment needed!**

## Example: Simplified Blog Post Template

```html
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article Title - Balog & Stoica Blog</title>
    <link rel="stylesheet" href="../Assets/general.css">
    <link rel="stylesheet" href="./blog.css">
</head>
<body>
    <!-- Navigation loads automatically -->

    <main>
        <article>
            <!-- article content -->
        </article>
    </main>

    <!-- Footer loads automatically -->

    <!-- Load components first -->
    <script src="../Assets/components.js"></script>
    <script src="../Assets/general.js"></script>
    <script src="./blog.js"></script>
</body>
</html>
```

## Benefits

✅ **Single source of truth** - Update nav/footer in ONE place
✅ **Automatic path fixing** - Works at any page depth
✅ **No build tools required** - Pure JavaScript
✅ **Easy to maintain** - Change once, updates everywhere
✅ **Fast loading** - Minimal JavaScript overhead

## Updating Navigation

To add/remove/change nav items, edit **one file**: [components.js](components.js)

```javascript
// In components.js - Navigation section
<div class="nav-links desktop">
    <a href="/index.html#about">Despre noi</a>
    <a href="/index.html#team">Echipa</a>
    <a href="/index.html#services">Specializări</a>
    <a href="/Blog/index.html">Blog</a>
    <a href="/index.html#contact">Contact</a>
    <!-- Add new links here -->
</div>
```

All pages using `components.js` will update automatically!

## Migration Steps

### To migrate existing pages:

1. **Backup** current files
2. **Remove** the `<nav>` HTML from page
3. **Remove** the `<footer>` HTML from page
4. **Add** `<script src="./Assets/components.js"></script>` before closing `</body>`
5. **Adjust** the path based on page depth:
   - Root: `./Assets/components.js`
   - One level deep: `../Assets/components.js`
   - Two levels deep: `../../Assets/components.js`

### Example Migration:

**Before:**
```html
<body>
    <nav class="navbar">
        <!-- 50 lines of nav HTML -->
    </nav>

    <main>...</main>

    <footer class="footer">
        <!-- 30 lines of footer HTML -->
    </footer>

    <script src="./script.js"></script>
</body>
```

**After:**
```html
<body>
    <!-- Nav loads automatically -->

    <main>...</main>

    <!-- Footer loads automatically -->

    <script src="./Assets/components.js"></script>
    <script src="./script.js"></script>
</body>
```

**Saved:** 80 lines of duplicated code per page!

## Alternative Approaches

### Option 1: Web Components (Custom Elements) ⭐ More Modern

```javascript
// Define custom element
class SiteNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<nav>...</nav>`;
    }
}
customElements.define('site-nav', SiteNav);
```

```html
<!-- Use in any page -->
<site-nav></site-nav>
```

**Pros:** Standards-compliant, encapsulated
**Cons:** Slightly more complex

### Option 2: Static Site Generator ⭐ Best Long-term

Use tools like **11ty**, **Hugo**, or **Jekyll**:

```html
<!-- In layout template -->
{% include "navigation.html" %}
```

**Pros:** True templates, no client-side JavaScript
**Cons:** Requires build step, learning curve

### Option 3: Server-Side Includes (SSI)

If server supports it:

```html
<!--#include virtual="/includes/nav.html" -->
```

**Pros:** Server-side, no JavaScript
**Cons:** Requires server configuration

## Recommendation

For current setup: **Use the JavaScript components approach** (Option 1)

- ✅ Works immediately with existing files
- ✅ No build tools or server config needed
- ✅ Easy to understand and maintain
- ✅ Can migrate to SSG later if needed

When the site grows significantly, consider migrating to **11ty** or **Hugo** for true templating.

## Troubleshooting

### Nav/Footer not appearing?

1. Check browser console for errors
2. Ensure `components.js` path is correct
3. Verify script loads before other scripts
4. Check that you removed the old `<nav>` HTML

### Paths broken?

1. The script auto-detects depth
2. Check that asset paths in CSS are relative
3. Verify image paths in components.js use `/Assets/` prefix

### Mobile menu not working?

1. Ensure `general.js` loads AFTER `components.js`
2. Check that event listeners initialize after DOM load
3. Verify mobile menu HTML structure is complete

---

**Need help?** Check the example pages or create a test page to verify setup.
