import type { SmartphoneReview } from '../lib/types';

export const smartphoneReviewsData: SmartphoneReview[] = [
  {
    id: '1',
    phoneName: 'iPhone 15 Pro',
    brand: 'Apple',
    reviewerName: 'MKBHD',
    reviewUrl: 'https://www.youtube.com/watch?v=YOUR_MKBHD_IPHONE15PRO_VIDEO_ID', // Replace with actual video ID
    summary: 'The iPhone 15 Pro refines the Apple experience with a titanium build, Action button, and USB-C. Powerful A17 Pro chip and improved cameras make it a top contender.',
    publicationDate: '2023-09-22',
    imageUrl: '/images/iphone-15-pro.jpg', // Placeholder - ensure you have this image in public/images
    rating: 4.5,
    pros: ['Lighter titanium design', 'Versatile Action button', 'Excellent camera system', 'Powerful A17 Pro chip', 'USB-C port'],
    cons: ['Expensive', 'Battery life could be better for ProMotion', 'Incremental update for some users'],
  },
  {
    id: '2',
    phoneName: 'Google Pixel 8 Pro',
    brand: 'Google',
    reviewerName: 'Mrwhosetheboss',
    reviewUrl: 'https://www.youtube.com/watch?v=YOUR_MRWHOSETHEBOSS_PIXEL8PRO_VIDEO_ID', // Replace with actual video ID
    summary: 'The Pixel 8 Pro shines with its AI-powered camera features, Tensor G3 chip, and a brighter display. Google promises 7 years of OS updates.',
    publicationDate: '2023-10-12',
    imageUrl: '/images/pixel-8-pro.jpg', // Placeholder - ensure you have this image
    rating: 4.7,
    pros: ['Outstanding camera performance with AI magic', 'Tensor G3 improvements', 'Bright and smooth display', '7 years of software support', 'Clean Android experience'],
    cons: ['Video recording still lags behind iPhone slightly', 'Tensor G3 not as powerful as competitors for gaming'],
  },
  {
    id: '3',
    phoneName: 'Samsung Galaxy S23 Ultra',
    brand: 'Samsung',
    reviewerName: 'Dave2D',
    reviewUrl: 'https://www.youtube.com/watch?v=YOUR_DAVE2D_S23ULTRA_VIDEO_ID', // Replace with actual video ID
    summary: 'The S23 Ultra continues to be a powerhouse with its Snapdragon 8 Gen 2 for Galaxy, versatile S Pen, and incredible zoom capabilities. A true flagship for productivity and photography.',
    publicationDate: '2023-02-17',
    imageUrl: '/images/samsung-s23-ultra.jpg', // Placeholder - ensure you have this image
    rating: 4.8,
    pros: ['Best-in-class zoom camera', 'Powerful Snapdragon 8 Gen 2 for Galaxy', 'Integrated S Pen', 'Beautiful Dynamic AMOLED 2X display', 'Long battery life'],
    cons: ['Very large and heavy', 'Expensive', 'Software can feel bloated for some'],
  },
]; 