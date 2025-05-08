
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  avatar?: string;
  className?: string;
}

const TestimonialCard = ({
  content,
  author,
  role,
  avatar,
  className,
}: TestimonialCardProps) => {
  return (
    <div 
      className={cn(
        "bg-white p-6 rounded-xl shadow-md border border-gray-100 card-hover", 
        className
      )}
    >
      <div className="flex items-start mb-4">
        <svg
          className="h-8 w-8 text-idish-orange opacity-80 mr-2"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-gray-700 mb-6">{content}</p>
      <div className="flex items-center">
        {avatar ? (
          <img
            src={avatar}
            alt={author}
            className="h-10 w-10 rounded-full mr-3 object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-idish-peach flex items-center justify-center mr-3">
            <span className="font-medium text-idish-orange">
              {author.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h4 className="font-medium text-gray-900">{author}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
