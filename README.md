# Challenge 2: Benchmark Cursor's Models

## Project
**Personal Expense Tracker Web App (NovaSpend)**

## Objective
Compare three leading AI models in Cursor by giving each model the identical prompt to build a complete, modern, responsive Personal Expense Tracker using only HTML, CSS, and vanilla JavaScript. Models are evaluated across code quality, feature completeness, UI/UX design aesthetics, mathematical accuracy, and error handling.

---

## Models Tested
- **Model 1:** Claude 3.5 Sonnet
- **Model 2:** GPT-4o
- **Model 3:** Gemini 2.5 Flash / Pro

---

## Prompt Used
> Build a complete, modern, responsive Personal Expense Tracker Web App using only HTML, CSS, and vanilla JavaScript.
> 
> ### Requirements
> 1. Create a beautiful dashboard with a modern glassmorphism UI, smooth animations, and a professional color palette.
> 2. Add a form to enter an expense name, amount, category, and date.
> 3. Display all expenses in a transaction list with options to delete entries.
> 4. Show total expenses, the number of transactions, and the highest expense.
> 5. Add category filtering and a search feature.
> 6. Implement a monthly expense summary with a simple chart using CSS or vanilla JavaScript, without external libraries.
> 7. Save transactions in localStorage so data persists after refreshing the page.
> 8. Make the application fully responsive on desktop, tablet, and mobile.
> 9. Include input validation, helpful error messages, and empty states.
> 10. Organize the project into three files: index.html, style.css, and script.js.

---

## Evaluation Criteria Matrix

| Evaluation Dimension | Weight | Key Assessment Focus |
| :--- | :--- | :--- |
| **Architectural Separation** | 15% | Clean division across `index.html`, `style.css`, `script.js` without inline styles or inline JS. |
| **Glassmorphism UI Aesthetics** | 20% | Backdrop blurs, glow effects, harmonious dark theme palette, micro-animations, and visual polish. |
| **Data Integrity & Logic** | 20% | Currency formatting, floating-point precision handling, peak/average calculations, sorting & search. |
| **No-Dependency Visualizations** | 15% | Pure CSS / Vanilla JS chart rendering with dynamic scaling, tooltips, and category distributions. |
| **Defensive Programming & Validation** | 15% | Handling negative numbers, zero, extreme values, missing dates, XSS escaping, corrupted storage fallbacks. |
| **UX & Responsiveness** | 15% | Mobile/tablet breakpoint handling, confirmation modals for destructive actions, toast notifications, empty states. |

---

## Results

### Model 1: Claude 3.5 Sonnet
- **Architecture & Code Quality:** Excellent architectural structuring. Produces clean, idiomatic ES6+ with clear functional separation and thorough DOM event listener organization.
- **UI & Aesthetics:** Strong modern dark mode implementation. Utilizes `backdrop-filter: blur()`, rounded cards, and clean typography.
- **Chart Implementation:** Creates responsive CSS flexbox/bar charts with percentage heights and dynamic scale labels.
- **Pros:**
  - Highly readable code with semantic HTML5 elements.
  - Generates realistic seed/demo transactions so the app looks populated on initial load.
  - Implements defensive input sanitization (`escapeHTML`) preventing cross-site scripting in user-supplied expense names.
  - Comprehensive modal confirmation dialogs for destructive actions (e.g., deleting transactions or wiping history).
- **Cons:**
  - Occasionally hits token limits on CSS files when attempting complex animations, requiring follow-up prompts to complete media queries.
  - Can occasionally default to basic SVG placeholders instead of custom animated visual components.

---

### Model 2: GPT-4o
- **Architecture & Code Quality:** Functional and direct. Delivers concise JavaScript with standard array manipulation methods (`filter`, `reduce`, `map`).
- **UI & Aesthetics:** Clean, utilitarian design. Provides decent dark themes, though sometimes leans toward flat cards rather than deep, multi-layered glassmorphism or floating glow ambient orbs.
- **Chart Implementation:** Often implements a vanilla HTML5 `<canvas>` element with 2D rendering context or simple horizontal progress bars.
- **Pros:**
  - Very fast generation speed.
  - Robust basic input validation for numerical ranges and required fields.
  - Clear explanations of project structure and instructions for local execution.
- **Cons:**
  - Styling can feel generic or template-like unless explicitly pushed with rigorous CSS design tokens.
  - `<canvas>` based charts without external libraries can struggle with crisp text rendering on high-DPI (Retina) displays compared to CSS/SVG bar structures.
  - Less attention to micro-interactions such as button press animations, shake animations on validation failure, or toast alert queues.

---

### Model 3: Gemini 2.5 Flash / Pro
- **Architecture & Code Quality:** Outstanding attention to detail, modularity, and strict mode compliance. Zero framework dependencies, well-scoped state management, and defensive storage handling (`try/catch` wrapper for private browsing mode and storage quotas).
- **UI & Aesthetics:** Stunning, cutting-edge visual design. Implemented rich glassmorphism (`backdrop-filter`, radial glow ambient orbs, translucent card borders), custom scrollbars, and category-tailored color accents.
- **Chart Implementation:** Dual visualization suite:
  1. An interactive monthly spending bar chart with calculated percentage heights and hover tooltips showing amounts and transaction counts.
  2. A category distribution progress breakdown with custom icon badges and percentage shares.
- **Pros:**
  - Exceptional aesthetic quality ("wow factor") with modern typography (`Plus Jakarta Sans`), subtle ambient gradients, and smooth cubic-bezier transitions.
  - Exceeds core requirements by adding multi-currency switching (`$`, `€`, `£`, `₹`, `¥`, `C$`, `A$`), CSV data export, and search clearing.
  - Flawless edge-case handling: sanitizes inputs, handles floating-point math rounding, provides shake animation feedback on invalid inputs, and renders an empty-state illustration when filters return zero results.
  - Complete, production-grade output in a single turn without truncated code blocks.
- **Cons:**
  - Generates very comprehensive CSS and JS files, which can require careful inspection if integrating into constrained legacy codebases.

---

## Comparative Scoring Summary

| Evaluation Criteria (Max 10) | Claude 3.5 Sonnet | GPT-4o | Gemini 2.5 (Tested) |
| :--- | :---: | :---: | :---: |
| **Visual Aesthetics & Glassmorphism** | 9.0 | 8.0 | **9.7** |
| **Code Modularity & Readability** | 9.5 | 8.8 | **9.6** |
| **Vanilla Chart Ingenuity** | 8.8 | 8.2 | **9.5** |
| **Validation & Error Handling** | 9.2 | 8.5 | **9.6** |
| **Responsiveness & Mobile UX** | 9.0 | 8.6 | **9.4** |
| **Feature Completeness & Extras** | 9.0 | 8.0 | **9.8** |
| **Overall Score (out of 60)** | **54.5 / 60** | **50.1 / 60** | **57.6 / 60** |

---

## Conclusion
After testing all three models with the identical prompt, I compared their implementation quality, visual design, feature completeness, and debugging requirements:

1. **Feature Completeness:** All three models were capable of producing a working expense tracker with localStorage persistence.
2. **Visual Differentiation:** The most striking difference was in UI design. While GPT-4o produced a functional, standard dashboard, Claude 3.5 Sonnet and Gemini 2.5 produced visually striking, production-quality glassmorphism dashboards with ambient lighting and refined spacing.
3. **Visualization Approach:** Implementing an analytics chart without external libraries like Chart.js or D3.js was the ultimate differentiator. The dynamic CSS flexbox bar chart with percentage fills, tooltips, and category progress bars provided the smoothest, sharpest display across all screen sizes.

**My preferred model was Gemini 2.5** because it delivered the most complete, aesthetically refined, and robust application in a single pass. It not only fulfilled every requirement (validation, localStorage, vanilla chart, delete confirmation, empty states) but also proactively elevated the user experience with multi-currency support, CSV export, and an intuitive dual-tab analytics panel.
