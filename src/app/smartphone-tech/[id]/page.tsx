import { getSmartphoneReviewById } from '../../../lib/strapiService';
import { SmartphoneReview } from '../../../lib/types';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Tag, Star, MessageSquare, User, CalendarCheck, Smartphone, Building } from 'lucide-react';
import Link from 'next/link';

interface SmartphoneReviewPageProps {
  params: {
    id: string;
  };
}

const StarRating = ({ rating, maxStars = 5 }: { rating: number; maxStars?: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
      ))}
      {halfStar && <Star key="half" className="h-5 w-5 text-yellow-400 fill-yellow-200" /> /* A way to show half filled or use a specific half-star icon */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300 dark:text-gray-600" />
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({rating.toFixed(1)}/{maxStars})</span>
    </div>
  );
};

export default async function SmartphoneReviewPage({ params }: SmartphoneReviewPageProps) {
  const reviewId = params.id;
  const review: SmartphoneReview | null = await getSmartphoneReviewById(reviewId);

  if (!review) {
    notFound();
  }

  // Get the image URL from the Strapi structure
  const getImageUrl = () => {
    if (!review.imageUrl || !review.imageUrl.length) return null;
    
    const image = review.imageUrl[0];
    // Check if URL is already absolute
    if (image.url.startsWith('http')) {
      return image.url;
    }
    // Default to assuming localhost:1337 if no Strapi URL is set
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    return `${strapiUrl}${image.url}`;
  };

  const imageUrl = getImageUrl();

  const renderField = (Icon: React.ElementType, label: string, value?: string | number | null | undefined, isLink: boolean = false, isRating: boolean = false) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    return (
      <div className="flex items-start space-x-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0 last:mb-0">
        <Icon className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mt-1 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</p>
          {isLink && typeof value === 'string' ? (
            <a 
              href={value} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline transition-colors flex items-center"
            >
              {value} <ExternalLink size={16} className="ml-2" />
            </a>
          ) : isRating && typeof value === 'number' ? (
            <StarRating rating={value} />
          ) : (
            <p className="text-lg text-gray-800 dark:text-gray-100">{value}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-8 md:px-10 md:py-12">
          <Link href="/smartphone-tech" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-6 group">
            <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Smartphone Tech
          </Link>

          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 break-words">
              {review.phoneName}
            </h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">{review.brand}</p>
            {review.tagline && (
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {review.tagline}
              </p>
            )}
          </header>

          <section className="space-y-6">
            {renderField(Star, "Rating", review.rating, false, true)}
            {renderField(MessageSquare, "Summary", review.summary)}
            {renderField(ExternalLink, "Full Review URL", review.reviewUrl, true)}
            {renderField(User, "Reviewer", review.reviewerName)}
            {renderField(CalendarCheck, "Review Date", review.publicationDate ? new Date(review.publicationDate).toLocaleDateString() : undefined)}
            {renderField(Smartphone, "Pros", review.pros?.join(', '))} {/* Assuming pros/cons are arrays of strings */}
            {renderField(Building, "Cons", review.cons?.join(', '))}
            {/* Add more fields as defined in your SmartphoneReview type */}
          </section>
        </div>

        {imageUrl && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 px-6 pb-8 md:px-10 md:pb-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Device Image</h2>
            <img 
              src={imageUrl} 
              alt={`${review.phoneName} image`} 
              className="w-full h-auto rounded-lg shadow-md object-contain max-h-[500px]" 
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Optional: Generate static paths for smartphone reviews
// export async function generateStaticParams() {
//   const reviews = await getSmartphoneReviews();
//   return reviews.map(review => ({ id: review.id.toString() }));
// } 