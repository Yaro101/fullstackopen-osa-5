import React from 'react';

const BlogForm = ({ onSubmit, newBlog, setNewBlog }) => {
    return (
        <form id="blog-form" onSubmit={onSubmit}>
            <div>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    data-testid="title"
                    type="text"
                    value={newBlog.title}
                    name="Title"
                    onChange={({ target }) =>
                        setNewBlog({ ...newBlog, title: target.value })
                    }
                />
            </div>
            <div>
                <label htmlFor="author">Author</label>
                <input
                    id="author"
                    data-testid="author"
                    type="text"
                    value={newBlog.author}
                    name="Author"
                    onChange={({ target }) =>
                        setNewBlog({ ...newBlog, author: target.value })
                    }
                />
            </div>
            <div>
                <label htmlFor="url">Url</label>
                <input
                    id="url"
                    data-testid="url"
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
