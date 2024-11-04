import { X } from "lucide-react"; // Import the close icon

type NewsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl: string;
  avatarFallback: string;
  userName: string;
  date: string;
  title: string;
  description: string;
  urlToImage?: string;
  categories: string[];
};

export function NewsModal({
  isOpen,
  onClose,
  avatarUrl,
  avatarFallback,
  userName,
  date,
  title,
  description,
  urlToImage,
  categories,
}: NewsModalProps) {
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-4xl h-5/6 overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header with Avatar and User Info */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full w-full text-gray-500">
                {avatarFallback}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{userName}</h2>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>

        {/* Title and Description */}
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-gray-700 mb-4 break-words text-justify">{description}</p> {/* Wraps text */}

        {/* Image */}
        {urlToImage && (
          <img
            src={urlToImage}
            alt="News Image"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full"
            >
              {category}
            </span>
          ))}
        </div> 
      </div>
    </div>
  );
}
