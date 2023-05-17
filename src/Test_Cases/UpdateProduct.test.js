import React from 'react';
import { shallow } from 'enzyme';
import { Dialog, TextField, Button } from '@mui/material';
import UpdateProduct from '../pages/products/UpdateProduct';
import { Formik, Form } from 'formik';
import ContextProvider from '../context/ContextProvider';
import { render, fireEvent, screen } from '@testing-library/react';
describe('UpdateProduct', () => {
  let wrapper;
  const product = {
    id: 1,
    name: 'Product 1',
    price: 10,
    weight: 100,
  };
  const handleClose = jest.fn();
  
  beforeEach(() => {
    wrapper = shallow(<UpdateProduct product={product} handleClose={handleClose} />);
  });
 
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    expect(wrapper.exists()).toBe(true);
  });
  it('should render a Dialog component', () => {
    expect(wrapper.find(Dialog)).toHaveLength(1);
  });

  it('should render three TextField components', () => {
    expect(wrapper.find(Formik).dive().find(TextField)).toHaveLength(3);
  });
 
});

