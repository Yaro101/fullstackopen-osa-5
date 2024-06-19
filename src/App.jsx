import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import "../index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [newNotification, setNewNotification] = useState({
    message: null,
    type: "",
  });
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
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
      setNewNotification({ message: "Login successful", type: "success" });
      setTimeout(() => {
        setNewNotification({ message: null, type: "" });
      }, 4000);
    } catch (exception) {
      setNewNotification({
        message: "wrong username or password",
        type: "error",
      });
      setTimeout(() => {
        setNewNotification({ message: null, type: "" });
      }, 4000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
    blogService.setToken(null);
    setNewNotification({ message: "Logged out", type: "success" });
    setTimeout(() => {
      setNewNotification({ message: null, type: "" });
    }, 4000);
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    try {
      const newBlogObject = await blogService.create(newBlog);
      setBlogs(blogs.concat(newBlogObject));
      setNewBlog({ title: "", author: "", url: "" });
      setNewNotification({
        message: `A new blog '${newBlogObject.title}' by ${newBlogObject.author} added`,
        type: "success",
      });
      setTimeout(() => {
        setNewNotification({ message: null, type: "" });
      }, 5000);
    } catch (exception) {
      setNewNotification({
        message: "Failed to create a new blog",
        type: "error",
      });
      setTimeout(() => {
        setNewNotification({ message: null, type: "" });
      }, 4000);
    }
  };

  const displayBlogs = () => (
    <div>
      {user && (
        <p>
          <em>
            <b>{user.name}</b>
          </em>{" "}
          logged-in <button onClick={handleLogout}>logout</button>
        </p>
      )}
      {user && (
        <Togglable buttonLabel="new blog">
          <BlogForm
            onSubmit={handleCreateBlog}
            newBlog={newBlog}
            setNewBlog={setNewBlog}
          />
        </Togglable>
      )}
      <div>
        <br />
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h1>Blogs</h1>
      <Notification
        message={newNotification.message}
        type={newNotification.type}
      />
      {user === null && (
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      )}
      {displayBlogs()}
    </div>
  );
};

export default App;
