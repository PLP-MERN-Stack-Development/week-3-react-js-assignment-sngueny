import { useState, useMemo } from 'react';
import { Loader2, Search, RefreshCw, Users, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApi } from '@/hooks/useApi';
import { Post, User } from '@/types';

export function ApiDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'posts' | 'users'>('posts');
  
  const itemsPerPage = 6;

  const { 
    data: posts, 
    loading: postsLoading, 
    error: postsError, 
    refetch: refetchPosts 
  } = useApi<Post[]>('https://jsonplaceholder.typicode.com/posts');

  const { 
    data: users, 
    loading: usersLoading, 
    error: usersError, 
    refetch: refetchUsers 
  } = useApi<User[]>('https://jsonplaceholder.typicode.com/users');

  const filteredData = useMemo(() => {
    const data = activeTab === 'posts' ? posts : users;
    if (!data || !searchTerm) return data || [];
    
    return data.filter(item => {
      if (activeTab === 'posts') {
        const post = item as Post;
        return post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               post.body.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        const user = item as User;
        return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.company.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
  }, [activeTab, posts, users, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const loading = activeTab === 'posts' ? postsLoading : usersLoading;
  const error = activeTab === 'posts' ? postsError : usersError;
  const refetch = activeTab === 'posts' ? refetchPosts : refetchUsers;

  return (
    <div className="space-y-6">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            API Data Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'posts' ? 'default' : 'outline'}
              onClick={() => {
                setActiveTab('posts');
                setCurrentPage(1);
                setSearchTerm('');
              }}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Posts ({posts?.length || 0})
            </Button>
            <Button
              variant={activeTab === 'users' ? 'default' : 'outline'}
              onClick={() => {
                setActiveTab('users');
                setCurrentPage(1);
                setSearchTerm('');
              }}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Users ({users?.length || 0})
            </Button>
          </div>

          {/* Search and Refresh */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Results Info */}
          <div className="text-sm text-muted-foreground">
            {searchTerm ? (
              <>Showing {filteredData.length} results for "{searchTerm}"</>
            ) : (
              <>Total {activeTab}: {filteredData.length}</>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="animate-fade-in">
          <CardContent className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading {activeTab}...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="animate-fade-in border-destructive">
          <CardContent className="py-8 text-center">
            <p className="text-destructive mb-4">Error: {error}</p>
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Data Grid */}
      {!loading && !error && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedData.map((item) => (
              <Card key={item.id} className="animate-slide-up hover:shadow-glow transition-all duration-200">
                <CardContent className="p-4">
                  {activeTab === 'posts' ? (
                    <PostCard post={item as Post} />
                  ) : (
                    <UserCard user={item as User} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm line-clamp-2 text-foreground">
        {post.title}
      </h3>
      <p className="text-xs text-muted-foreground line-clamp-3">
        {post.body}
      </p>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Post #{post.id}</span>
        <span>User {post.userId}</span>
      </div>
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-foreground">
        {user.name}
      </h3>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>@{user.username}</p>
        <p>{user.email}</p>
        <p>{user.phone}</p>
        <p className="font-medium text-primary">{user.company.name}</p>
        <p className="italic">{user.company.catchPhrase}</p>
      </div>
    </div>
  );
}