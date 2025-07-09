// Corrected version for: src/lib/cloudinary.ts

interface CloudinaryTransformations {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'thumb';
  }
  
  export function getCloudinaryImageUrl(
    publicId: string,
    transformations: CloudinaryTransformations = {}
  ): string {
  
    // 1. Read the cloud name from the environment variable
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
    if (!cloudName) {
      console.warn("Cloudinary cloud name is not configured.");
      return 'https://via.placeholder.com/800x600'; 
    }
  
    // 2. Build the transformation string (e.g., "w_1200,q_auto,f_auto")
    const transString = Object.entries(transformations)
      .map(([key, value]) => {
        const shortCode = { width: 'w', height: 'h', quality: 'q', format: 'f', crop: 'c' }[key];
        return `${shortCode}_${value}`;
      })
      .join(',');
  
    // 3. Assemble the final, correct URL structure
    // This now correctly places the transformation string right after /upload/
    const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
    return `${baseUrl}/${transString ? transString + '/' : ''}${publicId}`;
  }