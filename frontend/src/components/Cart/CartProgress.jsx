import React from "react";

const CartProgress = () => {
  return (
    <div className="free-progress-bar">
      <p className="progress-bar-title">
        Sepete <strong>1000TL</strong> ve üzeri ürün ekle, ücretsiz kargodan faydalan.
      </p>
      <div className="progress-bar">
        <span className="progress"></span>
      </div>
    </div>
  );
};

export default CartProgress;
