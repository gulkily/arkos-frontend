import { useEffect, useState } from "react";

function getNotificationTone(status) {
  switch (status) {
    case "review":
      return "notification-popup__item--review";
    case "warning":
      return "notification-popup__item--warning";
    case "success":
      return "notification-popup__item--success";
    default:
      return "notification-popup__item--info";
  }
}

export default function NotificationPopup({ notifications = [], onDismiss }) {
  const [visibleNotifications, setVisibleNotifications] = useState(notifications);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  function handleDismiss(notificationId) {
    setVisibleNotifications((currentNotifications) =>
      currentNotifications.filter((notification) => notification.id !== notificationId),
    );

    onDismiss?.(notificationId);
  }

  return (
    <aside className="notification-popup" aria-label="Notifications" aria-live="polite">
      <div className="notification-popup__header">
        <p className="notification-popup__eyebrow">Notifications</p>
        <p className="notification-popup__count">{visibleNotifications.length} active</p>
      </div>

      {visibleNotifications.length === 0 ? (
        <p className="notification-popup__empty">No active notifications.</p>
      ) : (
        <ul className="notification-popup__list">
          {visibleNotifications.map((notification) => (
            <li
              key={notification.id}
              className={`notification-popup__item ${getNotificationTone(notification.status)}`}
            >
              <div className="notification-popup__item-header">
                <div>
                  <p className="notification-popup__title">{notification.title}</p>
                  <p className="notification-popup__message">{notification.message}</p>
                </div>
                <button
                  type="button"
                  className="notification-popup__dismiss"
                  onClick={() => handleDismiss(notification.id)}
                  aria-label={`Dismiss notification: ${notification.title}`}
                >
                  Dismiss
                </button>
              </div>
              <p className="notification-popup__meta">{notification.timeLabel ?? "Now"}</p>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
