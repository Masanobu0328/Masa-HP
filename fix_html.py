
import re

file_path = "src/data/posts.ts"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define regex replacements
# Using \s* to handle optional spaces more robustly
replacements = [
    # Headers
    (r'<\s*h([1-6])\s*>', r'<h\1>'),
    (r'<\s*/\s*h([1-6])\s*>', r'</h\1>'),

    # Ordered Lists
    (r'<\s*ol\s*>', '<ol>'),
    (r'<\s*/\s*ol\s*>', '</ol>'),

    # Pre-existing fixes (to ensure consistency if run again)
    (r'<\s*div\s*>', '<div>'), # catch plain div
    (r'<\s*div', '<div'), # catch div with attributes
    (r'<\s*p\s*>', '<p>'),
    (r'<\s*ul\s*>', '<ul>'),
    (r'<\s*li\s*>', '<li>'),
    (r'<\s*strong\s*>', '<strong>'),
    (r'<\s*span', '<span'),
    (r'<\s*br\s*>', '<br>'),
    (r'<\s*svg', '<svg'),
    (r'<\s*path', '<path'),
    
    # Closing tags
    (r'<\s*/\s*p\s*>', '</p>'),
    (r'<\s*/\s*div\s*>', '</div>'),
    (r'<\s*/\s*ul\s*>', '</ul>'),
    (r'<\s*/\s*li\s*>', '</li>'),
    (r'<\s*/\s*strong\s*>', '</strong>'),
    (r'<\s*/\s*span\s*>', '</span>'),
    (r'<\s*/\s*svg\s*>', '</svg>'),

    # Attributes
    (r'class\s*=\s*"', 'class="'),
    (r'alt\s*=\s*"', 'alt="'),
    (r'src\s*=\s*"', 'src="'),
    (r'width\s*=\s*"', 'width="'),
    (r'height\s*=\s*"', 'height="'),
    (r'viewBox\s*=\s*"', 'viewBox="'),
    (r'fill\s*=\s*"', 'fill="'),
    (r'stroke\s*=\s*"', 'stroke="'),
    
    # Specific attribute fixes for SVG
    (r'stroke\s*-\s*width', 'stroke-width'),
    (r'stroke\s*-\s*linecap', 'stroke-linecap'),
    (r'stroke\s*-\s*linejoin', 'stroke-linejoin'),
]

new_content = content
for pattern, replacement in replacements:
    new_content = re.sub(pattern, replacement, new_content, flags=re.IGNORECASE)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully applied regex replacement patterns including headers and ordered lists.")
