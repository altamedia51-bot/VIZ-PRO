import re

with open('src/components/CanvasRenderer.tsx', 'r') as f:
    content = f.read()

old_logic = """      } else if ((el.type === 'text' || el.type === 'subtitle') && ctx) {"""
new_logic = """      } else if (el.type === 'image') {
        const imgEl = el as any;
        const w = (imgEl.width || 48) * elScale;
        const h = (imgEl.height || 48) * elScale;
        hit = x >= el.x - w / 2 && x <= el.x + w / 2 && y >= el.y - h / 2 && y <= el.y + h / 2;
      } else if ((el.type === 'text' || el.type === 'subtitle') && ctx) {"""

content = content.replace(old_logic, new_logic)

with open('src/components/CanvasRenderer.tsx', 'w') as f:
    f.write(content)

print("Done")
