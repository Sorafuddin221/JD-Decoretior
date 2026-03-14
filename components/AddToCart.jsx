"use client";

import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addItemsToCart } from '../features/cart/cartSlice';

const AddToCart = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleAddToCart = () => {
    if (isAuthenticated) {
      dispatch(addItemsToCart({ id: product._id, quantity: 1 }));
      toast.success("Item successfully added to your cart.");
    } else {
      toast.error("Please log in to your account to continue.");
    }
  };

  return (
    <button
      className="add-to-cart-btn"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
};

export default AddToCart;
