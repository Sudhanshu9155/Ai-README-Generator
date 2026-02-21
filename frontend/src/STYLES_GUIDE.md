/* ============================================
   PROFESSIONAL COMPONENT STYLES GUIDE
   ============================================ */

/**
 * HOW TO USE PROFESSIONAL STYLES IN YOUR COMPONENTS
 * 
 * This file shows how to apply professional styling to components
 * using the new CSS classes defined in index.css
 */

/* ============================================
   CARDS
   ============================================ */

/* Basic professional card */
/* <div className="card p-6"> */

/* Card with hover effect */
/* <div className="card-hover p-6"> */

/* Compact card for lists */
/* <div className="card-compact p-4"> */

/* ============================================
   BUTTONS
   ============================================ */

/* Primary button (blue gradient) */
/* <button className="btn-primary">Click Me</button> */

/* Secondary button (outline) */
/* <button className="btn-secondary">Click Me</button> */

/* Outline button */
/* <button className="btn-outline">Click Me</button> */

/* Danger button (red gradient) */
/* <button className="btn-danger">Delete</button> */

/* Success button (green gradient) */
/* <button className="btn-success">Confirm</button> */

/* Small button */
/* <button className="btn-primary btn-sm">Small</button> */

/* ============================================
   FORM ELEMENTS
   ============================================ */

/* Text input */
/* <input type="text" className="input-field" placeholder="Enter text..." /> */

/* Textarea */
/* <textarea className="textarea-field" placeholder="Enter details..."></textarea> */

/* ============================================
   BADGES & TAGS
   ============================================ */

/* Primary badge */
/* <span className="badge-primary">New</span> */

/* Success badge */
/* <span className="badge-success">Active</span> */

/* Warning badge */
/* <span className="badge-warning">Pending</span> */

/* Danger badge */
/* <span className="badge-danger">Failed</span> */

/* Gray badge */
/* <span className="badge-gray">Inactive</span> */

/* ============================================
   TYPOGRAPHY
   ============================================ */

/* Heading 1 */
/* <h1 className="h1">Main Title</h1> */

/* Heading 2 */
/* <h2 className="h2">Section Title</h2> */

/* Muted text */
/* <p className="text-muted">Secondary text</p> */

/* Light text */
/* <p className="text-light">Tertiary text</p> */

/* ============================================
   ANIMATIONS
   ============================================ */

/* Slide in from bottom */
/* <div className="animate-slideInUp">Content</div> */

/* Slide in from top */
/* <div className="animate-slideInDown">Content</div> */

/* Fade with scale */
/* <div className="animate-fadeInScale">Content</div> */

/* Soft pulse */
/* <div className="animate-pulse-soft">Content</div> */

/* ============================================
   GRADIENT BACKGROUNDS
   ============================================ */

/* Primary gradient (purple gradient) */
/* <div className="bg-gradient-primary text-white p-8"> */

/* Success gradient (green gradient) */
/* <div className="bg-gradient-success text-white p-8"> */

/* Danger gradient (red gradient) */
/* <div className="bg-gradient-danger text-white p-8"> */

/* ============================================
   SHADOW UTILITIES
   ============================================ */

/* Extra small shadow */
/* <div className="shadow-sm-custom"> */

/* Medium shadow */
/* <div className="shadow-md-custom"> */

/* Large shadow */
/* <div className="shadow-lg-custom"> */

/* Extra large shadow */
/* <div className="shadow-xl-custom"> */

/* ============================================
   PROFESSIONAL LAYOUT PATTERNS
   ============================================ */

/* Hero Section */
/*
<div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
  <div className="max-w-7xl mx-auto px-4 text-center">
    <h1 className="text-5xl font-bold mb-4">Welcome</h1>
    <p className="text-xl text-indigo-100">Subtitle here</p>
  </div>
</div>
*/

/* Feature Grid */
/*
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
  <div className="card-hover p-6">
    <h3 className="h4 mb-2">Feature</h3>
    <p className="text-muted">Description</p>
  </div>
</div>
*/

/* Form Section */
/*
<div className="card p-8 max-w-md mx-auto">
  <h2 className="h3 mb-6">Form Title</h2>
  <div className="space-y-4">
    <input type="text" className="input-field" placeholder="Name" />
    <input type="email" className="input-field" placeholder="Email" />
    <textarea className="textarea-field" placeholder="Message"></textarea>
    <button className="btn-primary w-full">Submit</button>
  </div>
</div>
*/

/* Stats Card */
/*
<div className="card-hover p-6 text-center">
  <p className="text-light text-sm">Total Users</p>
  <p className="text-4xl font-bold text-indigo-600 my-2">1,234</p>
  <span className="badge-success">+12% this month</span>
</div>
*/

/* ============================================
   COLOR SCHEME
   ============================================ */

/* Primary Colors */
/* Indigo: #4f46e5, #6366f1 (use for buttons, links, highlights) */
/* Gray: #1f2937, #6b7280 (use for text, borders) */
/* White: #ffffff (use for backgrounds) */

/* Status Colors */
/* Success (Green): #10b981, #34d399 (use for positive actions) */
/* Danger (Red): #ef4444, #f87171 (use for destructive actions) */
/* Warning (Yellow): #f59e0b, #fbbf24 (use for alerts) */
/* Info (Blue): #3b82f6, #60a5fa (use for information) */

/* ============================================
   SPACING GUIDELINES
   ============================================ */

/* Padding: p-4, p-6, p-8 */
/* Margin: m-4, m-6, m-8 */
/* Gap: gap-4, gap-6, gap-8 */
/* Rounded: rounded-lg, rounded-xl */

/* ============================================
   HOVER & INTERACTION STATES
   ============================================ */

/* All buttons and cards have hover states */
/* All transitions are 300ms for consistency */
/* Active states scale down slightly (active:scale-95) */
/* Focus states use ring-2 ring-indigo-500 */

/**
 * For consistency across the app, always use:
 * - btn-primary for main actions
 * - btn-secondary for secondary actions
 * - btn-danger for destructive actions
 * - card for containing content
 * - card-hover for interactive sections
 * - input-field for all text inputs
 * - badge-* for status indicators
 */
