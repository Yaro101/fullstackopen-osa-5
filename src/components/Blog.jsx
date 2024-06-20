import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, updateBlogLikes }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      updateBlogLikes(returnedBlog);
    } catch (exception) {
      console.error("error updating likes", exception);
    }
  };

  const blogStyle = {
    padding: 10,
    border: "solid grey",
    borderWidth: 1,
    marginBottom: 5,
  };
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={toggleVisibility}>{visible ? "hide" : "show"}</button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <div>
            Likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <p>{blog.user.name}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
