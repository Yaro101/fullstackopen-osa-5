const Blog = ({ blog }) => (
  <div>
    Title: {blog.title} <br />
    Author: {blog.author} <br />
    Link: {blog.url} <br />
    Likes: {blog.likes} <br />
    {blog.user.name} <br />
    <br />
  </div>
);

export default Blog;
