import React, { useState } from 'react';
import { PlusCircle, PencilIcon, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlogForm from './BlogForm';

const initialBlogs = [
  {
    id: 1,
    title: "The Art of Cake Decorating",
    content: "Cake decorating is a form of art that requires patience, creativity, and skill...",
    images: ["/placeholder.svg?height=200&width=300"],
    date: "2023-06-01",
  },
];

const BlogsContent = () => {
  const [blogs, setBlogs] = useState(initialBlogs);

  const handleAddBlog = (newBlog) => {
    const id = Math.max(...blogs.map(b => b.id), 0) + 1;
    setBlogs(prevBlogs => [...prevBlogs, { ...newBlog, id, date: new Date().toISOString().split('T')[0] }]);
  };

  const handleUpdateBlog = (updatedBlog) => {
    setBlogs(prevBlogs => prevBlogs.map(blog => 
      blog.id === updatedBlog.id ? updatedBlog : blog
    ));
  };

  const handleDeleteBlog = (id) => {
    setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Blog Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Blog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Blog</DialogTitle>
            </DialogHeader>
            <BlogForm onSubmit={handleAddBlog} />
          </DialogContent>
        </Dialog>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <Card key={blog.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                    <p className="text-sm text-gray-600">{blog.content.substring(0, 100)}...</p>
                    <p className="text-sm text-gray-600">Date: {blog.date}</p>
                  </div>
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mr-2">
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Blog</DialogTitle>
                        </DialogHeader>
                        <BlogForm blog={blog} onSubmit={handleUpdateBlog} />
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteBlog(blog.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogsContent;

