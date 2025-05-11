import Image from 'next/image';
import Link from 'next/link';
import type { SmartphoneReview } from '../../lib/types';
import { ExternalLink, Star, MessageSquareText, CalendarCheck2, Tag, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ReviewCardProps {
  review: SmartphoneReview;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const detailPageUrl = `/smartphone-tech/${review.id}`;

  // Get the image URL from the Strapi structure
  const getImageUrl = () => {
    if (!review.imageUrl || !review.imageUrl.length) return null;
    
    const image = review.imageUrl[0];
    // Check if URL is already absolute
    if (image.url.startsWith('http')) {
      return image.formats?.medium?.url || image.url;
    }
    // Default to assuming localhost:1337 if no Strapi URL is set
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    return `${strapiUrl}${image.formats?.medium?.url || image.url}`;
  };

  const imageUrl = getImageUrl();

  const renderStars = (rating?: number) => {
    if (rating === undefined) return null;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0; 
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} size={18} className="text-yellow-400 fill-yellow-400" />)}
        {halfStar && <Star key="half" size={18} className="text-yellow-400 fill-yellow-200" />}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} size={18} className="text-gray-300 dark:text-gray-600" />)}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col h-full">
      {imageUrl && (
        <Link href={detailPageUrl} className="block relative w-full h-52 cursor-pointer group">
          <div className="relative w-full h-full">
            <img 
              src={imageUrl} 
              alt={`${review.phoneName} image`} 
              className="w-full h-full object-cover bg-gray-100 dark:bg-gray-700 group-hover:opacity-90 transition-opacity"
            />
          </div>
        </Link>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <Link href={detailPageUrl} className="cursor-pointer group">
          <h3 className="text-2xl font-semibold mb-1 text-indigo-600 dark:text-indigo-400 group-hover:underline">
            {review.phoneName}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
          <Tag size={16} className="mr-2" /> Brand: {review.brand}
        </p>
        {review.rating !== undefined && (
          <div className="mb-3">
            {renderStars(review.rating)}
          </div>
        )}
        <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm flex-grow line-clamp-4">
          {review.summary}
        </p>
        
        {(review.pros && review.pros.length > 0) && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1 flex items-center"><ThumbsUp size={16} className="mr-1"/> Pros:</h4>
            <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
              {review.pros.slice(0, 3).map((pro, index) => <li key={`pro-${index}`}>{pro}</li>)} 
              {review.pros.length > 3 && <li className="text-xs text-gray-500 dark:text-gray-500">...and more</li>}
            </ul>
          </div>
        )}

        {(review.cons && review.cons.length > 0) && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1 flex items-center"><ThumbsDown size={16} className="mr-1"/> Cons:</h4>
            <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
              {review.cons.slice(0, 3).map((con, index) => <li key={`con-${index}`}>{con}</li>)}
              {review.cons.length > 3 && <li className="text-xs text-gray-500 dark:text-gray-500">...and more</li>}
            </ul>
          </div>
        )}

        <div className="mt-auto border-t dark:border-gray-700 pt-4">
          {review.reviewerName && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center truncate">
              <MessageSquareText size={14} className="mr-2 flex-shrink-0" /> Reviewed by: {review.reviewerName}
            </p>
          )}
          {review.publicationDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center">
              <CalendarCheck2 size={14} className="mr-2 flex-shrink-0" /> 
              {new Date(review.publicationDate).toLocaleDateString()}
            </p>
          )}
          {review.reviewUrl ? (
            <a 
              href={review.reviewUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Watch/Read Review <ExternalLink size={18} className="ml-2" />
            </a>
          ) : (
            <p className="text-sm text-center text-gray-400 dark:text-gray-500">No review link available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard; 