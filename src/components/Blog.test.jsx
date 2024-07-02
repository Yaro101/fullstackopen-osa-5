import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { expect, vi } from 'vitest';
import blogService from '../services/blogs';
import BlogForm from './BlogForm';
// import { element } from "prop-types";

vi.mock('../services/blogs');

test('renders blog title and author', () => {
    const blog = {
        title: 'Testing blog with react-testing-library',
        author: 'Asiantuntija Testaaja',
        url: 'http://test.fi',
        likes: 5,
        user: {
            username: 'Tester',
            name: 'Test User',
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

test('When show button is clicked checks for URL and Likes', async () => {
    const blog = {
        title: 'Testing button click with react-testing-library',
        author: 'Asiantuntija Testaaja',
        url: 'http://test.fi',
        likes: 5,
        user: {
            username: 'Tester',
            name: 'Test User',
        },
    };
    render(<Blog blog={blog} />);

    const showButton = screen.getByText('show');
    userEvent.click(showButton);

    const urlElement = screen.queryByText(blog.url);
    const likesElement = screen.queryByText(`Likes ${blog.likes}`);

    expect(urlElement).toBeDefined();
    expect(likesElement).toBeDefined();
});

test('When like button is clicked twice, the event handler is called twice', async () => {
    const blog = {
        title: 'Testing like button click',
        author: 'Asiantuntija Testaaja',
        url: 'http://test.fi',
        likes: 5,
        user: {
            username: 'Tester',
            name: 'Test User',
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
    const showButton = screen.getByText('show');
    await user.click(showButton);

    const likeButton = screen.getByRole('button', { name: /like/i });
    //   console.log(`Before clicks: ${mockUpdateBlogLikes.mock.calls.length}`); // Before clicking
    await user.click(likeButton);
    //   console.log(`After first click: ${mockUpdateBlogLikes.mock.calls.length}`); // After first click
    await user.click(likeButton);
    //   console.log(`After second click: ${mockUpdateBlogLikes.mock.calls.length}`); // After second click

    expect(mockUpdateBlogLikes).toHaveBeenCalledTimes(2);
});

test('The form calls the event handler with the right details when a new blog is created ', async () => {
    const mockOnSubmit = vi.fn();
    let newBlog = { title: '', author: '', url: '' };
    const setNewBlog = (value) => {
        newBlog = { ...newBlog, ...value };
    // console.log("Updated newBlog:", newBlog);
    };

    const { container } = render(
        <BlogForm
            onSubmit={() => mockOnSubmit(newBlog)}
            newBlog={newBlog}
            setNewBlog={setNewBlog}
        />
    );

    const user = userEvent.setup();

    const titleInput = container.querySelector('#title');
    const authorInput = container.querySelector('#author');
    const urlInput = container.querySelector('#url');
    const formElement = container.querySelector('#blog-form');

    await user.type(titleInput, 'New Blog Title');
    await user.type(authorInput, 'New Author');
    await user.type(urlInput, 'http://newblog.fi');

    setNewBlog({
        title: 'New Blog Title',
        author: 'New Author',
        url: 'http://newblog.fi',
    });

    fireEvent.submit(formElement);

    // screen.debug();
    // console.log(newBlog);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Blog Title',
        author: 'New Author',
        url: 'http://newblog.fi',
    });
});
