const Notification = ({ message, type }) => {
    if (message === null) {
        return null;
    }
    const successStyle = {
        color: 'hsl(98, 97%, 36%)',
        background: 'rgba(211, 211, 211, 0.418)',
    };
    const errorStyle = {
        color: 'hsla(357, 90%, 43%, 0.801)',
        background: 'rgba(211, 211, 211, 0.336)',
    };

    const style = type === 'error' ? errorStyle : successStyle;

    return (
        <div className="notification-message" style={style}>
            {message}
        </div>
    );
};

export default Notification;
