from PIL import Image, ImageDraw
import os


img = Image.new('RGB', (200, 200), color='#cccccc')
draw = ImageDraw.Draw(img)
draw.text((85, 80), 'A', fill='black')

os.makedirs('backend/media/avatars/', exist_ok=True)
img.save('backend/media/avatars/default-avatar.png')