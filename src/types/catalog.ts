export type NamedRef = {
  _id: string;
  name: string;
  slug: string;
};

export type ProductCard = {
  _id: string;
  name: string;
  slug: string;
  price?: number;
  images?: string[];
  shortDescription?: string;
  isFeatured?: boolean;
  brand?: NamedRef | null;
  category?: NamedRef | null;
};

export type ProductDetail = ProductCard & {
  description: string;
  compareAtPrice?: number;
  specs?: Array<{ label: string; value: string }>;
  features?: string[];
  isAdvertised?: boolean;
};
