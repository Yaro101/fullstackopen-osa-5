import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import Togglable from "./Togglable";

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

test("When show button is clicked render URL and Likes", async () => {
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
  
  const showButton = screen.getByText("show")
  userEvent.click(showButton);

  const urlElement = screen.queryByText(blog.url)
  const likesElement = screen.queryByText(`Likes ${blog.likes}`)

  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()

});
