import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BlogForm = ({ blog, onSubmit }) => {
  const [images, setImages] = useState(blog?.images || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBlog = {
      title: formData.get('title'),
      content: formData.get('content'),
      images: images,
      date: blog?.date || new Date().toISOString().split('T')[0],
    };
    onSubmit(newBlog);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="title" className="text-right">Title</label>
          <Input id="title" name="title" defaultValue={blog?.title} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="content" className="text-right">Content</label>
          <Textarea id="content" name="content" defaultValue={blog?.content} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label className="text-right">Images</label>
          <div className="col-span-3">
            <Input id="image" name="image" type="file" onChange={handleImageUpload} accept="image/*" />
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((img, index) => (
                <img key={index} src={img || "/placeholder.svg"} alt={`Blog image ${index + 1}`} className="w-20 h-20 object-cover" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Save Blog</Button>
      </div>
    </form>
  );
};

export default BlogForm;

