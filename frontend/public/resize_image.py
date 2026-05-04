from PIL import Image
import os

# Open the image
img = Image.open('round.png')

# Get current size
width, height = img.size
print(f"Current size: {width}x{height}")

# Resize to 60% of original size (adjust percentage as needed)
new_width = int(width * 0.6)
new_height = int(height * 0.6)

# Resize with high quality
resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

# Save the resized image, replacing the original
resized_img.save('round.png', optimize=True, quality=85)

print(f"New size: {new_width}x{new_height}")
print("Image resized successfully!")
