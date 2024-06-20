import React, { useState } from "react";

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => {
    setVisible(!visible);
  };
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
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
            Likes {blog.likes} <button>like</button>
          </div>
          <p>{blog.user.name}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
