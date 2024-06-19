import React from "react";

const BlogForm = ({ onSubmit, newBlog, setNewBlog }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        Title
        <input
          type="text"
          value={newBlog.title}
          name="Title"
          onChange={({ target }) =>
            setNewBlog({ ...newBlog, title: target.value })
          }
        />
      </div>
      <div>
        Author
        <input
          type="text"
          value={newBlog.author}
          name="Author"
          onChange={({ target }) =>
            setNewBlog({ ...newBlog, author: target.value })
          }
        />
      </div>
      <div>
        Url
        <input
          type="text"
          value={newBlog.url}
          name="URL"
          onChange={({ target }) =>
            setNewBlog({ ...newBlog, url: target.value })
          }
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;