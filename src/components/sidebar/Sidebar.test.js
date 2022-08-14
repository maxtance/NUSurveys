import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "./Sidebar";

describe("Tests for Sidebar Component", () => {
  it("Renders without crashing", () => {
    renderSidebar(
      () => {},
      () => {}
    );
    const sidebarComponent = screen.queryByTestId("sidebar");
    expect(sidebarComponent).toBeInTheDocument();
  });

  it("Calls eligibility event handler when eligibility checkbox is clicked", () => {
    const eligibilityHandler = jest.fn();
    const typeHandler = jest.fn();
    const remunerationHandler = jest.fn();
    const statusHandler = jest.fn();
    renderSidebar(
      eligibilityHandler,
      typeHandler,
      remunerationHandler,
      statusHandler,
    );
    const checkbox = screen.getByTestId("eligibility");
    userEvent.click(checkbox);
    expect(eligibilityHandler).toBeCalled();
    expect(typeHandler).not.toBeCalled();
    expect(remunerationHandler).not.toBeCalled();
    expect(statusHandler).not.toBeCalled();
  });

  it("Calls type event handler when research study (remote) checkbox is clicked", () => {
    const eligibilityHandler = jest.fn();
    const typeHandler = jest.fn();
    const remunerationHandler = jest.fn();
    const statusHandler = jest.fn();
    renderSidebar(
      eligibilityHandler,
      typeHandler,
      remunerationHandler,
      statusHandler
    );
    const checkbox = screen.getByTestId("remote");
    userEvent.click(checkbox);
    expect(typeHandler).toBeCalled();
    expect(eligibilityHandler).not.toBeCalled();
    expect(remunerationHandler).not.toBeCalled();
    expect(statusHandler).not.toBeCalled();
  });

  it("Calls remuneration event handler when vouchers checkbox is clicked", () => {
    const eligibilityHandler = jest.fn();
    const typeHandler = jest.fn();
    const remunerationHandler = jest.fn();
    const statusHandler = jest.fn();
    renderSidebar(
      eligibilityHandler,
      typeHandler,
      remunerationHandler,
      statusHandler
    );
    const checkbox = screen.getByTestId("vouchers");
    userEvent.click(checkbox);
    expect(remunerationHandler).toBeCalled();
    expect(eligibilityHandler).not.toBeCalled();
    expect(typeHandler).not.toBeCalled();
    expect(statusHandler).not.toBeCalled();
  });

  it("Calls status event handler when ongoing checkbox is clicked", () => {
    const eligibilityHandler = jest.fn();
    const typeHandler = jest.fn();
    const remunerationHandler = jest.fn();
    const statusHandler = jest.fn();
    renderSidebar(
      eligibilityHandler,
      typeHandler,
      remunerationHandler,
      statusHandler
    );
    const checkbox = screen.getByTestId("ongoing");
    userEvent.click(checkbox);
    expect(statusHandler).toBeCalled();
    expect(eligibilityHandler).not.toBeCalled();
    expect(typeHandler).not.toBeCalled();
    expect(remunerationHandler).not.toBeCalled();
  });

  it("Cancel button is disabled when no checkbox is clicked", () => {
    renderSidebar(
      () => {},
      () => {},
      () => {},
      () => {},
      () => {}
    );
    const button = screen.getByTestId("cancel");
    expect(button).toBeDisabled();
  });
});

const renderSidebar = (
  eligibilityHandler,
  typeHandler,
  remunerationHandler,
  statusHandler
) => {
  const type = {
    1: false,
    2: false,
    3: false,
  };
  const remuneration = {
    1: false,
    2: false,
    3: false,
  };
  const status = {
    ongoing: false,
    closed: false,
  };
  const eligibility = false;
  render(
    <Sidebar
      type={type}
      remuneration={remuneration}
      status={status}
      eligibility={eligibility}
      handleEligibilityChange={eligibilityHandler}
      handleTypeChange={typeHandler}
      handleRemunerationChange={remunerationHandler}
      handleStatusChange={statusHandler}
    />
  );
};
