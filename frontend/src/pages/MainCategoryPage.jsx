import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message } from "antd";

const MainCategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/categories/${categoryId}/products`);

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          message.error("Ürünleri getirme başarısız.");
        }
      } catch (error) {
        console.log("Ürün hatası:", error);
      }
    };

    fetchProducts();
  }, [apiUrl, categoryId]);

  return (
    <div>
      <h2>Kategoriye Ait Ürünler</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MainCategoryPage;