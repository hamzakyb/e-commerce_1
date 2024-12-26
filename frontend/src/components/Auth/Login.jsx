import { message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Yanıtı:", data); // Yanıtı konsola yazdırarak kontrol edin
        if (data && data.id) { // 'id' alanını kontrol ediyoruz
          localStorage.setItem("user", JSON.stringify(data));
          message.success("Giriş başarılı.");
          if (data.role === "admin") {
            window.location.href = "/admin";
          } else {
            navigate("/");
          }
        } else {
          message.error("Kullanıcı bilgileri alınamadı.");
        }
      } else {
        message.error("Giriş başarısız.");
      }
    } catch (error) {
      console.log("Giriş hatası:", error);
      message.error("Bir hata oluştu.");
    }
  };

  return (
    <div className="account-column">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            <span>
              Username or email address <span className="required">*</span>
            </span>
            <input type="text" name="email" onChange={handleInputChange} required/>
          </label>
        </div>
        <div>
          <label>
            <span>
              Password <span className="required">*</span>
            </span>
            <input
              type="password"
              name="password"
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <p className="remember">
          <label>
            <input type="checkbox" />
            <span>Beni hatırla</span>
          </label>
          <button className="btn btn-sm">Login</button>
        </p>
        <a href="#" className="form-link">
          Şifreni mi unuttun?
        </a>
      </form>
    </div>
  );
};

export default Login;