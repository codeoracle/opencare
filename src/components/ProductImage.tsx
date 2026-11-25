type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

export function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || "/images/placeholder.svg"}
      alt={alt}
      loading="lazy"
      className={`h-full w-full object-contain ${className}`}
    />
  );
}
