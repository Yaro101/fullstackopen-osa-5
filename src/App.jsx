import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "../index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJASON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJASON) {
      const user = JSON.parse(loggedUserJASON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
    blogService.setToken(null);
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    try {
      const newBlogObject = await blogService.create(newBlog);
      setBlogs(blogs.concat(newBlogObject));
      setNewBlog({ title: "", author: "", url: "" });
    } catch (exception) {
      setErrorMessage("Failed to create a new blog");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const blogForm = () => (
    <form onSubmit={handleCreateBlog}>
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

  const displayBlogs = () => (
    <div>
      <h1>Blogs</h1>
      <p>
        <em>
          <b>{user.name}</b>
        </em>{" "}
        logged-in <button onClick={handleLogout}>logout</button>
      </p>
      <div>{blogForm()}</div>
      <div>
        <br />
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );

  return <div>{user === null ? loginForm() : displayBlogs()}</div>;
};

export default App;
