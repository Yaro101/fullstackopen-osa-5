import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, updateBlogLikes, removeBlog }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      returnedBlog.user = blog.user;
      updateBlogLikes(returnedBlog);
    } catch (exception) {
      console.error("error updating likes", exception);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        removeBlog(blog.id);
      } catch (exception) {
        console.error("Error removing blog:", exception);
      }
    }
  };

  const blogStyle = {
    padding: 10,
    border: "solid grey",
    borderWidth: 1,
    marginBottom: 5,
  };

  const loggedUser = JSON.parse(localStorage.getItem("loggedBlogAppUser"))

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
          {blog.user.username === loggedUser.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
