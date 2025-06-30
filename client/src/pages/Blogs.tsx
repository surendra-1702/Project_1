import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, PenTool, Search, Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getAuthHeaders } from '@/lib/auth';

interface Blog {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  category: string;
  imageUrl: string | null;
  published: boolean;
  likes: number | null;
  createdAt: string;
  userId: number;
}

const categories = [
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'muscle-gain', label: 'Muscle Gain' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'motivation', label: 'Motivation' },
  { value: 'beginner-tips', label: 'Beginner Tips' },
];

export default function Blogs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    category: '',
    published: true
  });

  // Fetch blogs
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['/api/blogs', { category: selectedCategory, search: searchQuery }],
    queryFn: async () => {
      let url = '/api/blogs?limit=20&offset=0';
      if (selectedCategory && selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch blogs');
      return response.json();
    },
  });

  // Create blog mutation
  const createBlogMutation = useMutation({
    mutationFn: async (blogData: any) => {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          ...blogData,
          excerpt: blogData.content.substring(0, 150) + '...',
        }),
      });
      if (!response.ok) throw new Error('Failed to create blog');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      setShowCreateDialog(false);
      setNewBlog({ title: '', content: '', category: '', published: true });
      toast({
        title: "Blog Posted",
        description: "Your blog post has been published successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Post",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Like blog mutation
  const likeBlogMutation = useMutation({
    mutationFn: async (blogId: number) => {
      const response = await fetch(`/api/blogs/${blogId}/like`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        // Try to unlike instead
        const unlikeResponse = await fetch(`/api/blogs/${blogId}/like`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        if (!unlikeResponse.ok) throw new Error('Failed to toggle like');
        return { action: 'unliked' };
      }
      return { action: 'liked' };
    },
    onSuccess: (data, blogId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      toast({
        title: data.action === 'liked' ? "Blog Liked" : "Like Removed",
        description: data.action === 'liked' ? "You liked this blog post" : "You removed your like",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create blog posts",
        variant: "destructive",
      });
      return;
    }

    if (!newBlog.title || !newBlog.content || !newBlog.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    createBlogMutation.mutate(newBlog);
  };

  const handleLike = (blogId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }
    likeBlogMutation.mutate(blogId);
  };

  const handleComment = (blogId: number) => {
    toast({
      title: "Comments",
      description: "Comments feature coming soon!",
    });
  };

  const handleShare = (blogId: number) => {
    navigator.clipboard.writeText(`${window.location.origin}/blogs/${blogId}`);
    toast({
      title: "Link Copied",
      description: "Blog link has been copied to clipboard",
    });
  };

  const handleRead = (blogId: number) => {
    toast({
      title: "Reading View",
      description: "Full blog reading view coming soon!",
    });
  };

  const filteredBlogs = blogs.filter((blog: Blog) => {
    if (searchQuery && !blog.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !blog.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getAuthorInfo = (blog: Blog) => {
    // For demo purposes, generate initials from user ID
    const initials = `U${blog.userId}`;
    const name = `User ${blog.userId}`;
    return { initials, name };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Fitness Community Blogs</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Share your fitness journey, tips, and motivation with the community
            </p>
          </div>

          {/* Blog Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-fitness-primary text-white hover:opacity-90">
                  <PenTool className="h-4 w-4 mr-2" />
                  Write Blog Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Blog Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateBlog} className="space-y-4">
                  <div>
                    <Label htmlFor="blog-title">Title</Label>
                    <Input
                      id="blog-title"
                      placeholder="Enter blog title..."
                      value={newBlog.title}
                      onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="blog-category">Category</Label>
                    <Select value={newBlog.category} onValueChange={(value) => setNewBlog({...newBlog, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="blog-content">Content</Label>
                    <Textarea
                      id="blog-content"
                      placeholder="Write your blog content here..."
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                      rows={10}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createBlogMutation.isPending}
                      className="bg-fitness-primary text-white hover:opacity-90"
                    >
                      {createBlogMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        'Publish Blog'
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Clear Filters */}
          {(selectedCategory || searchQuery) && (
            <div className="mb-6 flex items-center gap-4 justify-center">
              <div className="flex items-center gap-2">
                {selectedCategory && (
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Category: {categories.find(c => c.value === selectedCategory)?.label}
                  </span>
                )}
                {searchQuery && (
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Search: {searchQuery}
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Blog Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading blogs...</span>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                {searchQuery || selectedCategory ? 
                  'No blogs found matching your criteria' : 
                  'No blog posts yet'
                }
              </div>
              {user && (
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-fitness-primary text-white hover:opacity-90"
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  Write the First Post
                </Button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredBlogs.map((blog: Blog) => (
                <BlogCard
                  key={blog.id}
                  blog={{
                    ...blog,
                    createdAt: new Date(blog.createdAt)
                  }}
                  author={getAuthorInfo(blog)}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                  onRead={handleRead}
                  commentCount={Math.floor(Math.random() * 20)} // Mock comment count
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredBlogs.length > 0 && filteredBlogs.length >= 20 && (
            <div className="text-center">
              <Button
                variant="outline"
                className="bg-gray-600 text-white hover:bg-gray-700"
              >
                Load More Posts
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
