import { useContext, useState, useEffect } from "react";
import { CartContext } from "../../context/CartProvider";
import { Spin, message } from "antd";

const CartTotals = () => {
  const [fastCargoChecked, setFastCargoChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cartItems } = useContext(CartContext);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri alınırken bir hata oluştu:", error);
      message.error("Kullanıcı bilgileri alınırken bir hata oluştu.");
    }
  }, []);

  const cartItemTotals = cartItems.map((item) => item.price * item.quantity);
  const subTotals = cartItemTotals.reduce((prev, curr) => prev + curr, 0);
  const cargoFee = 0;
  const cartTotals = fastCargoChecked
    ? (subTotals + cargoFee).toFixed(2)
    : subTotals.toFixed(2);

  const handleOrder = async () => {
    setLoading(true);
    if (!user || !user.id) { // 'id' kontrolü yapılıyor
      message.info("Sipariş vermek için giriş yapın.");
      setLoading(false);
      return;
    }

    const orderItems = cartItems.map((item) => ({
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      subTotal: item.price * item.quantity,
    }));

    const body = {
      orderItems,
      userId: user.id, // 'user' yerine 'userId' kullanılıyor
      cargoFee: fastCargoChecked ? cargoFee : 0,
    };

    try {
      const res = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        message.error(`Sipariş işlemi başarısız oldu: ${errorData.error}`);
        return;
      }

      message.success("Sipariş başarıyla oluşturuldu.");
    } catch (error) {
      console.log("Hata:", error);
      message.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-totals">
      <h2>Sepet Toplamı</h2>
      <table>
        <tbody>
          <tr className="cart-subtotal">
            <th>Ara Toplam</th>
            <td>
              <span id="subtotal">{subTotals.toFixed(2)} TL</span>
            </td>
          </tr>
          <tr>
            <th>Kargo</th>
            <td>
              <ul>
                <li>
                  <label>
                    Hızlı Kargo: Ücretsiz
                    <input
                      type="checkbox"
                      id="fast-cargo"
                      checked={fastCargoChecked}
                      onChange={() => setFastCargoChecked(!fastCargoChecked)}
                    />
                  </label>
                </li>
                <li>
                  <a href="#">Adresi Değiştir</a>
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <th>Toplam</th>
            <td>
              <strong id="cart-total">{cartTotals} TL</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="checkout">
        <Spin spinning={loading}>
          <button className="btn btn-lg" onClick={handleOrder}>
            Sipariş Ver
          </button>
        </Spin>
      </div>
    </div>
  );
};

export default CartTotals;