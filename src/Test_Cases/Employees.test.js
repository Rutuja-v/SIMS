import { shallow } from "enzyme";
import { render, screen } from "@testing-library/react";
import ContextProvider from "../context/ContextProvider";
import Employees from "../pages/employees/Employees";
import userEvent from "@testing-library/user-event";
import { Toolbar } from "@mui/material";
describe(Employees, () => {
  let employee;
  beforeAll(() => {
    employee = shallow(
      <ContextProvider>
        <Employees />
      </ContextProvider>
    );
  });

  it("render", () => {
    employee.find(Toolbar);
  });
  test("on initial render, the save button is disabled", async () => {
    render(
      <ContextProvider>
        <Employees />
      </ContextProvider>
    );

    expect(await screen.findByRole("button", { name: /add/i })).toBeEnabled();
  });
  test("if  name and username is entered, the add button becomes enabled", async () => {
    render(
      <ContextProvider>
        <Employees />
      </ContextProvider>
    );
    const nameInput = screen.getByLabelText(/name/i);
    userEvent.type(nameInput, "Mithu");

    expect(screen.getByRole("button", { name: /add/i })).toBeEnabled();
  });

  test("input fields update correctly", () => {
    render(
      <ContextProvider>
        <Employees />
      </ContextProvider>
    );

    const nameInputElement = screen.findByText("name");
    const usernameInputElement = screen.findByLabelText("username");
    const roleInputElement = screen.findByLabelText("role");
    const godownLocationInputElement = screen.findByLabelText("godownLocation");
    expect(nameInputElement.value).toBe(undefined);
    expect(usernameInputElement.value).toBe(undefined);
    expect(roleInputElement.value).toBe(undefined);
    expect(godownLocationInputElement.value).toBe(undefined);
  });
});
