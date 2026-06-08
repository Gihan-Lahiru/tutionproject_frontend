# Load System.Drawing assembly
Add-Type -AssemblyName System.Drawing

# Load the image
$imagePath = "round.png"
$image = [System.Drawing.Image]::FromFile((Resolve-Path $imagePath))

Write-Host "Original size: $($image.Width) x $($image.Height)"

# Create a new bitmap to hold the rotated image
$rotatedImage = New-Object System.Drawing.Bitmap($image.Width, $image.Height)
$graphics = [System.Drawing.Graphics]::FromImage($rotatedImage)

# Set high quality rendering
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Rotate 180 degrees
$graphics.TranslateTransform($image.Width / 2, $image.Height / 2)
$graphics.RotateTransform(180)
$graphics.TranslateTransform(-$image.Width / 2, -$image.Height / 2)

# Draw the rotated image
$graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)

# Dispose original image
$image.Dispose()
$graphics.Dispose()

# Save the rotated image
$rotatedImage.Save($imagePath, [System.Drawing.Imaging.ImageFormat]::Png)
$rotatedImage.Dispose()

Write-Host "Image rotated 180 degrees successfully!"
