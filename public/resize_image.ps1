# Load System.Drawing assembly
Add-Type -AssemblyName System.Drawing

# Load the image
$imagePath = "round.png"
$image = [System.Drawing.Image]::FromFile((Resolve-Path $imagePath))

# Get current dimensions
$currentWidth = $image.Width
$currentHeight = $image.Height
Write-Host "Current size: $currentWidth x $currentHeight"

# Calculate new dimensions (180% of original)
$newWidth = [int]($currentWidth * 1.8)
$newHeight = [int]($currentHeight * 1.8)

# Create new bitmap with new dimensions
$newImage = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
$graphics = [System.Drawing.Graphics]::FromImage($newImage)

# Set high quality rendering
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Draw resized image
$graphics.DrawImage($image, 0, 0, $newWidth, $newHeight)

# Dispose original image so we can overwrite
$image.Dispose()
$graphics.Dispose()

# Save the resized image (overwriting original)
$newImage.Save($imagePath, [System.Drawing.Imaging.ImageFormat]::Png)
$newImage.Dispose()

Write-Host "New size: $newWidth x $newHeight"
Write-Host "Image resized successfully!"
