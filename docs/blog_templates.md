# Blog Visual Templates

Copy and paste these templates into your blog post content (`src/data/posts.ts`) to add visual flair.

## 1. Talking Head (Masa)
Use this for introductions or important messages from you.

```html
<div class="chat-container">
    <div class="chat-avatar">
        <img src="/profile.jpg" alt="Masa" />
    </div>
    <div class="chat-bubble">
        <span class="chat-speaker">Masa</span>
        <p>ここにあなたのメッセージを入力します。<br>改行も使えます。</p>
    </div>
</div>
```

## 2. Talking Head (User / Voice)
Use this to represent the reader's thoughts or questions. "reverse" class puts it on the right.

```html
<div class="chat-container reverse">
     <div class="chat-bubble">
        <span class="chat-speaker">Voice</span>
        <p>「読者の心の声」や「質問」などをここに入れます。</p>
    </div>
</div>
```

## 3. Flow Diagram
Visualize a process or flow. You can add more steps by copying the `flow-step` and `flow-arrow` divs.

```html
<div class="flow-diagram">
    <div class="flow-step">Step 1</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step highlight">重要なStep<br>(強調)</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step">Step 3</div>
</div>
```

## 4. Info Box (Teal - Lightbulb)
For tips, summaries, or key points.

```html
<div class="info-box note">
    <div class="info-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg></div>
    <div class="info-content">
        <span class="info-title">ポイント</span>
        <p>ここに解説文を入れます。リストなども使えます。</p>
    </div>
</div>
```

## 5. Warning Box (Amber - Triangle)
For warnings, pitfalls, or things to avoid.

```html
<div class="info-box warning">
    <div class="info-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>
    <div class="info-content">
        <span class="info-title">注意点</span>
        <p>ここに警告文を入れます。</p>
    </div>
</div>
```
