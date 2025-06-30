import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Blog {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  category: string;
  imageUrl: string | null;
  published: boolean;
  likes: number | null;
  createdAt: Date;
  userId: number;
}

interface BlogCardProps {
  blog: Blog;
  author?: { name: string; initials: string };
  onLike?: (blogId: number) => void;
  onComment?: (blogId: number) => void;
  onShare?: (blogId: number) => void;
  onRead?: (blogId: number) => void;
  isLiked?: boolean;
  commentCount?: number;
}

export default function BlogCard({ 
  blog, 
  author = { name: 'Anonymous', initials: 'A' },
  onLike, 
  onComment, 
  onShare, 
  onRead,
  isLiked = false,
  commentCount = 0
}: BlogCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      'weight-loss': 'bg-red-100 text-red-800',
      'muscle-gain': 'bg-blue-100 text-blue-800',
      'nutrition': 'bg-green-100 text-green-800',
      'motivation': 'bg-orange-100 text-orange-800',
      'beginner-tips': 'bg-purple-100 text-purple-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryGradient = (category: string) => {
    const gradients = {
      'weight-loss': 'from-red-500 to-pink-600',
      'muscle-gain': 'from-blue-500 to-purple-600',
      'nutrition': 'from-green-500 to-teal-600',
      'motivation': 'from-orange-500 to-red-600',
      'beginner-tips': 'from-purple-500 to-indigo-600',
    };
    return gradients[category as keyof typeof gradients] || 'from-gray-500 to-gray-600';
  };

  const readTime = Math.max(1, Math.ceil(blog.content.length / 200)); // Approximate reading time

  return (
    <Card className="overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
      {/* Blog Image */}
      <div className={`aspect-video bg-gradient-to-br ${getCategoryGradient(blog.category)} relative overflow-hidden`}>
        {blog.imageUrl ? (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        )}
        
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-white bg-opacity-90 text-gray-800 font-medium">
            {blog.category.replace('-', ' ')}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 
          className="font-bold text-xl mb-3 line-clamp-2 hover:text-blue-600 cursor-pointer"
          onClick={() => onRead?.(blog.id)}
        >
          {blog.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.excerpt || blog.content.substring(0, 150) + '...'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 bg-gradient-to-r ${getCategoryGradient(blog.category)} rounded-full flex items-center justify-center text-white font-bold text-xs mr-3`}>
              <span>{author.initials}</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{author.name}</div>
              <div className="text-xs">
                {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">{readTime} min read</div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike?.(blog.id)}
              className={`flex items-center hover:text-red-500 transition-colors ${
                isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              <span>{blog.likes || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(blog.id)}
              className="flex items-center hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{commentCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(blog.id)}
              className="flex items-center hover:text-green-500 transition-colors"
            >
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRead?.(blog.id)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Read More
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
