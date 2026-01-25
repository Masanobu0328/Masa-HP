---
description: Enhance a blog post with visual elements (Talking Heads, Flow Diagrams, Info Boxes)
---

# Blog Visual Enhancement Workflow

This workflow guides the process of upgrading a text-heavy blog post into a visually engaging article using the "AI Craftsman" style.

## 1. Content Analysis
Read the target blog post content. Identify opportunities to insert the following elements:

*   **Intro/Hook**: Use a **Talking Head (Masa)** to welcome the reader or state the core problem.
*   **Complex Concepts/Procedures**: Use a **Flow Diagram** to visualize the steps or logic (e.g., Input -> Process -> Output).
*   **Key Lists/Summary**: Use an **Info Box (Teal)** with the SVG Lightbulb icon.
*   **Warnings/Pitfalls**: Use a **Warning Box (Amber)** with the SVG Alert Triangle icon.
*   **User Voice/Objections**: Use a **Reverse Talking Head (Voice/User)** to represent the reader's thoughts or questions.

## 2. Apply Visual Elements
Replace the identified text sections with the following HTML templates.

### Talking Head (Masa)
Used for the author's voice, key messages, or intros.
```html
<div class="chat-container">
    <div class="chat-avatar">
        <img src="/profile.jpg" alt="Masa" />
    </div>
    <div class="chat-bubble">
        <span class="chat-speaker">Masa</span>
        <p>YOUR_TEXT_HERE</p>
    </div>
</div>
```

### Talking Head (User/Voice)
Used for the reader's inner voice or questions.
```html
<div class="chat-container reverse">
     <div class="chat-bubble">
        <span class="chat-speaker">Voice</span> <!-- Or User -->
        <p>YOUR_TEXT_HERE</p>
    </div>
</div>
```

### Flow Diagram
Used for linear processes or relationships.
```html
<div class="flow-diagram">
    <div class="flow-step">STEP_1</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step highlight">STEP_2<br>(Highlight)</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">STEP_3</div>
</div>
```

### Info Box (Teal - Lightbulb)
Used for tips, summaries, or key points.
```html
<div class="info-box note">
    <div class="info-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg></div>
    <div class="info-content">
        <span class="info-title">TITLE_HERE</span>
        <p>CONTENT_HERE</p>
    </div>
</div>
```

### Warning Box (Amber - Triangle)
Used for warnings, risks, or "anti-patterns".
```html
<div class="info-box warning">
    <div class="info-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>
    <div class="info-content">
        <span class="info-title">TITLE_HERE</span>
        <p>CONTENT_HERE</p>
    </div>
</div>
```

## 3. Verify
*   Ensure all tags are closed.
*   Check that SVG icons are rendering correctly.
*   Verify the page layout in the browser.
