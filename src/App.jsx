import { useState } from "react";
import DeskScene from "./components/DeskScene";
import ModelQueryPanel from "./components/ModelQueryPanel";
import NotificationPopup from "./components/NotificationPopup";

const initialNotifications = [
  {
    id: "task-201",
    title: "Task status changed",
    message: "MIT-222 moved from In Progress to Review.",
    status: "review",
    timeLabel: "Just now",
  },
  {
    id: "agent-044",
    title: "Agent update",
    message: "Nathaniel left review notes on the frontend shell work.",
    status: "info",
    timeLabel: "5m ago",
  },
  {
    id: "task-187",
    title: "Task blocked",
    message: "Waiting on API schema confirmation before wiring live events.",
    status: "warning",
    timeLabel: "12m ago",
  },
];

export default function App() {
  const [notifications, setNotifications] = useState(initialNotifications);

  function handleDismissNotification(notificationId) {
    setNotifications((currentNotifications) =>
      currentNotifications.filter((notification) => notification.id !== notificationId),
    );
  }

  return (
    <main className="app-shell">
      <DeskScene
        notifications={notifications}
        notificationOverlay={
          <NotificationPopup notifications={notifications} onDismiss={handleDismissNotification} />
        }
      >
        <ModelQueryPanel />
      </DeskScene>
    </main>
  );
}
