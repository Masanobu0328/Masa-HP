---
name: UI Design Concept Mockup Generator
description: Generates 5 distinct UI/UX design concepts and presents them as high-fidelity HTML/CSS mockups in a single file for client review.
---

# UI Design Concept Mockup Generator

This skill enables the agent to quickly generate multiple design concepts (mockups) when a user needs to see different visual directions for a website before committing to a final design.

## Goal
To create a single, self-contained HTML file that showcases **5 distinct design concepts** based on the project's requirements (e.g., brand colors, typography, target audience). 

## How to Execute

1. **Information Gathering**:
   - Review the project's configuration (e.g., `site_data.md`, brand guidelines, target audience).
   - Identify the primary brand colors, typography, and intended vibe (e.g., organic, luxury, minimalist, pop).

2. **Concept Ideation (Default 5 Options, Always Follow User Specifications)**:
   - **Crucial Rule**: The user will ALWAYS specify the brand colors, design preferences, and the requested number of mockups (default 5 if unspecified). **You must strictly adhere to the user's provided colors and design directions** rather than using any hardcoded styles.
   - If the user provides a general prompt but no specific concepts, brainstorm distinct directions (e.g., Luxury, Minimalist, Organic, Bold, Standard) using the *user-specified* color palette and typography.
   - For each concept, clearly define *why* it fits the project goals and how the provided colors are applied.

3. **HTML/CSS Generation**:
   - Create a single file named `design_concepts_mockup.html`.
   - Use plain HTML and CSS within a `<style>` tag for portability. No external frameworks (like Tailwind or Bootstrap) unless explicitly requested.
   - Use CSS Variables (`:root`) to define the color palettes for easy adjustments.
   - Use realistic placeholder images (via Unsplash source URLs or similar) that fit the specific concept's vibe.

4. **Structure of the Output File**:
   - **Header**: Title of the project and a brief explanation of the page.
   - **Concept Cards (x5)**: For each of the 5 concepts, include:
     - **Title**: E.g., "Concept 1: Organic & Warm"
     - **Description**: A paragraph explaining *why* this design works, its target audience, and how the colors are used.
     - **Color Palette**: Visual swatches showing the primary, secondary, and text colors used in this specific concept.
     - **Mockup Window UI**: A stylized "browser window" frame (with red/yellow/green Mac-style dots).
     - **Mockup Canvas**: The actual CSS-based UI design showing a "Hero Section" (Logo, Navigation, Headline, Subheadline, Call-to-Action button, and background/imagery).

5. **Delivery**:
   - Save the file in the project's root directory.
   - Instruct the user to open the file in their browser or via Live Server to review the 5 options.

## Example Output Structure (Pseudo HTML)

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <style>
        /* CSS Variables, Reset, Typography */
        /* Concept Card Styles */
        /* Mockup UI specific styles for canvas-1 through canvas-5 */
    </style>
</head>
<body>
    <header class="presentation-header">
        <h1>Design Concepts & Mockups</h1>
        <p>5つの異なるデザインコンセプト（UIモックアップ）を作成しました。</p>
    </header>

    <div class="concept-container">
        <!-- Repeat this block 5 times with different concepts -->
        <div class="concept-card">
            <div class="concept-info">
                <h2>Concept 1: [Name]</h2>
                <p class="concept-desc">[Explanation of the concept]</p>
                <div class="palette">
                    <!-- Color Swatches -->
                </div>
            </div>
            <div class="mockup-window">
               <!-- Browser dots -->
            </div>
            <div class="mockup-canvas canvas-1">
                <!-- Hero Section HTML with specific styles -->
            </div>
        </div>
        <!-- End Repeat -->
    </div>
</body>
</html>
```
