import { fireEvent, render, screen } from "@testing-library/react";
import NotificationPopup from "./NotificationPopup";

const notifications = [
  {
    id: "task-1",
    title: "Task status changed",
    message: "MIT-222 moved to Review.",
    status: "review",
    timeLabel: "Now",
  },
  {
    id: "task-2",
    title: "Agent update",
    message: "Review notes were added.",
    status: "info",
    timeLabel: "2m ago",
  },
];

describe("NotificationPopup", () => {
  it("renders the passed notifications", () => {
    render(<NotificationPopup notifications={notifications} />);

    expect(screen.getByText("Task status changed")).toBeInTheDocument();
    expect(screen.getByText("Agent update")).toBeInTheDocument();
    expect(screen.getByText("2 active")).toBeInTheDocument();
  });

  it("removes a notification when dismiss is clicked", () => {
    const onDismiss = vi.fn();

    render(<NotificationPopup notifications={notifications} onDismiss={onDismiss} />);

    fireEvent.click(screen.getByLabelText("Dismiss notification: Task status changed"));

    expect(screen.queryByText("Task status changed")).not.toBeInTheDocument();
    expect(screen.getByText("Agent update")).toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledWith("task-1");
  });

  it("shows the empty state when no notifications remain", () => {
    render(<NotificationPopup notifications={[notifications[0]]} />);

    fireEvent.click(screen.getByLabelText("Dismiss notification: Task status changed"));

    expect(screen.getByText("No active notifications.")).toBeInTheDocument();
    expect(screen.getByText("0 active")).toBeInTheDocument();
  });
});
