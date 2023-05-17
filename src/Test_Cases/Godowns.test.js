import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Godowns from "../pages/dashboard/godowns/Godowns";
import ContextProvider from "../context/ContextProvider";

describe("Godowns component", () => {
  test('renders "Add new" button', () => {
    <ContextProvider>
      render(
      <Godowns />
      );
    </ContextProvider>;
    const addButton = screen.queryByRole("button", { name: /add new/i });
  });
});
