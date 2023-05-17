import { shallow } from "enzyme";
import ContextProvider, { Context } from "../context/ContextProvider";
import { render, screen } from "@testing-library/react";
import Products from "../pages/products/Products";
describe("Products", () => {
  let wrapper;
  it("renders without crashing", () => {
    shallow(
      <ContextProvider>
        <Products />
      </ContextProvider>
    );
  });

  test("input fields update correctly", () => {
    render(
      <ContextProvider>
        <Products />
      </ContextProvider>
    );

    const nameInputElement = screen.findByLabelText("name");
    const priceInputElement = screen.findByLabelText("price");
    const weightInputElement = screen.findByLabelText("weight");

    expect(nameInputElement.value).toBe(undefined);
    expect(priceInputElement.value).toBe(undefined);
    expect(weightInputElement.value).toBe(undefined);
  });
});
