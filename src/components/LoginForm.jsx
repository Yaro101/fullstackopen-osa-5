import PropTypes from 'prop-types';

const LoginForm = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password,
}) => {
    return (
        <div>
            <h2>Log in to application</h2>

            <form onSubmit={handleSubmit}>
                <div>
          username
                    <input
                        data-testid="username"
                        value={username}
                        onChange={handleUsernameChange}
                        // onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
          password
                    <input
                        data-testid="password"
                        type="password"
                        value={password}
                        // onChange={({ target }) => setPassword(target.value)}
                        onChange={handlePasswordChange}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    );
};

LoginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleUsernameChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
};

export default LoginForm;
