import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect, vi } from "vitest";
import blogService from '../services/blogs'

vi.mock('../services/blogs')

test("renders blog title and author", () => {
  const blog = {
    title: "Testing blog with react-testing-library",
    author: "Asiantuntija Testaaja",
    url: "http://test.fi",
    likes: 5,
    user: {
      username: "Tester",
      name: "Test User",
    },
  };

  render(<Blog blog={blog} />);

  //   screen.debug();

  const titleElement = screen.getByText(
    /Testing blog with react-testing-library/i
  );
  const authorElement = screen.getByText(/Asiantuntija Testaaja/i);

  expect(titleElement).toBeDefined();
  expect(authorElement).toBeDefined();
});

test("When show button is clicked checks for URL and Likes", async () => {
  const blog = {
    title: "Testing button click with react-testing-library",
    author: "Asiantuntija Testaaja",
    url: "http://test.fi",
    likes: 5,
    user: {
      username: "Tester",
      name: "Test User",
    },
  };
  render(<Blog blog={blog} />);

  const showButton = screen.getByText("show");
  userEvent.click(showButton);

  const urlElement = screen.queryByText(blog.url);
  const likesElement = screen.queryByText(`Likes ${blog.likes}`);

  expect(urlElement).toBeDefined();
  expect(likesElement).toBeDefined();
});

test("When like button is clicked twice, the event handler is called twice", async () => {
  const blog = {
    title: "Testing like button click",
    author: "Asiantuntija Testaaja",
    url: "http://test.fi",
    likes: 5,
    user: {
      username: "Tester",
      name: "Test User",
    },
  };

  // Mock the update function to avoid network calls
  blogService.update.mockResolvedValue({
    ...blog,
    likes: blog.likes + 1,
  });

  const mockUpdateBlogLikes = vi.fn();

  render(<Blog blog={blog} updateBlogLikes={mockUpdateBlogLikes} />);

  const user = userEvent.setup();
  const showButton = screen.getByText("show");
  await user.click(showButton);

  const likeButton = screen.getByRole("button", { name: /like/i });
//   console.log(`Before clicks: ${mockUpdateBlogLikes.mock.calls.length}`); // Before clicking
  await user.click(likeButton);
//   console.log(`After first click: ${mockUpdateBlogLikes.mock.calls.length}`); // After first click
  await user.click(likeButton);
//   console.log(`After second click: ${mockUpdateBlogLikes.mock.calls.length}`); // After second click

  expect(mockUpdateBlogLikes).toHaveBeenCalledTimes(2);
});
