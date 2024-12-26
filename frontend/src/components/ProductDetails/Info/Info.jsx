import PropTypes from "prop-types";
import "./Info.css";
import { useContext, useRef } from "react";
import { CartContext } from "../../../context/CartProvider";

const Info = ({ singleProduct }) => {
  const quantityRef = useRef();
  const { addToCart, cartItems } = useContext(CartContext);
  const originalPrice = singleProduct.price.current;
  const discountPercentage = singleProduct.price.discount;

  // İndirimli fiyatı hesaplama
  const discountedPrice =
    originalPrice - (originalPrice * discountPercentage) / 100;

  const filteredCard = cartItems.find(
    (cartItem) => cartItem._id === singleProduct._id
  );

  return (
    <div className="product-info-container">
      <div className="product-info">
        <h1 className="product-title">{singleProduct.name}</h1>
        <div className="product-review">
          <ul className="product-star">
            <li>
              <i className="bi bi-star-fill"></i>
            </li>
            <li>
              <i className="bi bi-star-fill"></i>
            </li>
            <li>
              <i className="bi bi-star-fill"></i>
            </li>
            <li>
              <i className="bi bi-star-fill"></i>
            </li>
            <li>
              <i className="bi bi-star-half"></i>
            </li>
          </ul>
          <span>2 Yorum</span>
        </div>
        <div className="product-price">
          <s className="old-price">{originalPrice.toFixed(2)}TL</s>
          <strong className="new-price">{discountedPrice.toFixed(2)}TL</strong>
        </div>
      </div>
      <div
        className="product-description"
        dangerouslySetInnerHTML={{ __html: singleProduct.description }}
      ></div>
      <form className="variations-form">
        <div className="variations">
          <div className="stock">
            <div className="stock-value">
              <span>Stok Sayısı: {singleProduct.stock}</span> {/* Stok sayısının burada göründüğünden emin olun */}
            </div>
          </div>
         
          <div className="cart-button">
            <input
              type="number"
              defaultValue="1"
              min="1"
              id="quantity"
              ref={quantityRef}
            />
            <button
              className="btn btn-lg btn-primary"
              id="add-to-cart"
              type="button"
              disabled={filteredCard}
              onClick={() =>
                addToCart({
                  ...singleProduct,
                  price: discountedPrice,
                  quantity: parseInt(quantityRef.current.value),
                })
              }
            >
              Sepete Ekle
            </button>
          </div>
          <div className="product-extra-buttons">
            <a href="#">
              <i className="bi bi-globe"></i>
              <span></span>
            </a>
            <a href="#">
              <i className="bi bi-heart"></i>
              <span>Favorilere Ekle</span>
            </a>
            <a href="#">
              <i className="bi bi-share"></i>
              <span>Ürünü Paylaş</span>
            </a>
          </div>
        </div>
      </form>
      <div className="divider"></div>
      <div className="product-meta">
        <div className="product-sku">
          <span>SKU:</span>
          <strong>BE45VGRT</strong>
        </div>
        <div className="product-categories">
          <span>Categories:</span>
          <strong>Filtreler</strong>
        </div>
        
      </div>
    </div>
  );
};

Info.propTypes = {
  singleProduct: PropTypes.object,
};

export default Info;