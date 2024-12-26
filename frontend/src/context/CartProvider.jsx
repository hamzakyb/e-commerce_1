import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : []
  );

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (cartItem) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === cartItem._id);

      if (existingItem) {
        // Eğer ürün zaten sepette varsa, sadece miktarını artır
        return prevCart.map((item) =>
          item._id === cartItem._id
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item
        );
      } else {
        // Ürün sepette yoksa, yeni ürünü sepete ekle
        return [
          ...prevCart,
          {
            ...cartItem,
            quantity: cartItem.quantity ? cartItem.quantity : 1,
          },
        ];
      }
    });

    // Stok miktarını güncelle
    cartItem.stock = cartItem.stock - cartItem.quantity;
  };

  const removeFromCart = (itemId) => {
    const filteredCartItems = cartItems.filter((cartItem) => {
      return cartItem._id !== itemId;
    });
    setCartItems(filteredCartItems);
  };

  return (
    <CartContext.Provider
      value={{
        addToCart,
        cartItems,
        setCartItems,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

CartProvider.propTypes = {
  children: PropTypes.node,
};