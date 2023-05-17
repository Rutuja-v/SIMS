import React from "react";
import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import ProductsStock from "../pages/productsStock/ProductsStock";
import ContextProvider from "../context/ContextProvider";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");

describe("ProductsStock", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders 'not mapped to godown' message when godown is undefined or null", () => {
    const { getByText } = render(
      <BrowserRouter>
        <ProductsStock godown={undefined} />
      </BrowserRouter>
    );

    expect(
      getByText("Oops! You are not mapped to a godown yet.")
    ).toBeInTheDocument();
  });
  test("renders 'no products in stock' message when godown has no products in stock", async () => {
    const godown = { id: 1, capacityInQuintals: 100 };

    axios.get.mockImplementation((url) => {
      if (url.includes("/stock")) {
        return Promise.resolve({ data: [] });
      } else if (url.includes("/currentCapacity")) {
        return Promise.resolve({ data: 50 });
      }
    });

    const { getByText } = render(
      <BrowserRouter>
        <ProductsStock godown={godown} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    expect(
      getByText("Oops! No products are in stock in this godown!")
    ).toBeInTheDocument();
  });
});
