import React, { useEffect, useState } from 'react';

// DB seed rows point at example.com — fall back to a deterministic
// placeholder per artwork id so the gallery never renders broken images.
const ArtImage = ({ product, className = '' }) => {
  const [src, setSrc] = useState(product.image_url);

  useEffect(() => {
    setSrc(product.image_url);
  }, [product.image_url]);

  return (
    <img
      src={src}
      alt={product.description}
      loading="lazy"
      className={className}
      onError={() => setSrc(`https://picsum.photos/seed/art-${product.id}/800/1000`)}
    />
  );
};

export default ArtImage;
