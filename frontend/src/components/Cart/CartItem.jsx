import PropTypes from "prop-types";
import { useContext } from "react";
import { CartContext } from "../../context/CartProvider";

const CartItem = ({ cartItem }) => {
  const { removeFromCart } = useContext(CartContext);

  return (
    <tr className="cart-item">
      <td></td>
      <td className="cart-image">
        <img src={cartItem.img[0]} alt="" />
        <i
          className="bi bi-x delete-cart"
          onClick={() => removeFromCart(cartItem._id)}
        ></i>
      </td>
      <td>{cartItem.name}</td>
      <td>{Number(cartItem.price).toFixed(2)}TL</td>
      <td className="product-quantity">{cartItem.quantity}</td>
      <td className="product-subtotal">
        ${(cartItem.price * cartItem.quantity).toFixed(2)}
      </td>
    </tr>
  );
};

CartItem.propTypes = {
  cartItem: PropTypes.object,
};

export default CartItem;