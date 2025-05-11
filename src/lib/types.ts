export const WEBSITE_NAME = 'All-in-One Tech Tools Hub'
export const WEBSITE_DESCRIPTION = 'All-in-One Tech Tools Hub - Your Source for Tech Reviews & AI Tools'
export const EMAIL = 'luke@wilsonriplag.com'
export const NAME = 'WilsonIIRIP/LUKE'

// Define common Strapi image format type
interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  url: string;
}

interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: StrapiImageFormat;
    large: StrapiImageFormat;
    medium: StrapiImageFormat;
    small: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface AITool {
  id: number | string;
  documentId?: string;
  name: string;
  category: string;
  description: string;
  url: string;
  tags: string[];
  pricing: string;
  ReviewDate: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  imageUrl: StrapiImage[];
}

export interface SmartphoneReview {
  id: number | string;
  documentId?: string;
  title: string;
  brand: string;
  model: string;
  score: number;
  pros: string[];
  cons: string[];
  summary: string;
  full_review: string;
  release_date: string;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  imageUrl: StrapiImage[];
}
