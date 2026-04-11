import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders DeskScene with mock notifications and clears to the empty state", () => {
    render(<App />);

    expect(screen.getByText("3 notifications loaded")).toBeInTheDocument();
    expect(screen.getByText("Task status changed")).toBeInTheDocument();
    expect(screen.getByText("Agent update")).toBeInTheDocument();
    expect(screen.getByText("Task blocked")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Dismiss notification: Task status changed"));
    fireEvent.click(screen.getByLabelText("Dismiss notification: Agent update"));
    fireEvent.click(screen.getByLabelText("Dismiss notification: Task blocked"));

    expect(screen.getByText("0 notifications loaded")).toBeInTheDocument();
    expect(screen.getByText("No active notifications.")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Restore mock notifications"));

    expect(screen.getByText("3 notifications loaded")).toBeInTheDocument();
    expect(screen.getByText("Task status changed")).toBeInTheDocument();
  });
});
