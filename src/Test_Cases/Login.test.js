import { shallow } from "enzyme";
import Login, { LoginTest } from "../Components/Login";
import ContextProvider from "../context/ContextProvider";
import { Snackbar } from "@mui/material";
import axios from "axios";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";

jest.mock("axios");

describe("Login component", () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(
      <ContextProvider>
        <LoginTest />
      </ContextProvider>
    );
  });

  it("renders without crashing", () => {
    expect(wrapper.exists()).toBe(true);
  });

  test("input fields update correctly", () => {
    <ContextProvider>
      render(
      <LoginTest />
      );
    </ContextProvider>;
    const usernameInputElement = screen.findByText("Username");
    const passwordInputElement = screen.findByLabelText("password");
    expect(usernameInputElement.value).toBe(undefined);
    expect(passwordInputElement.value).toBe(undefined);
  });
});
