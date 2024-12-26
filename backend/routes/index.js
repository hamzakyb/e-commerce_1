const express = require("express");
const router = express.Router();

// Diğer rota dosyalarını içe aktarıyoruz.
const categoryRoute = require("./categories.js");
const authRoute = require("./auth.js");
const productRoute = require("./products.js");
const couponRoute = require("./coupons.js");
const userRoute = require("./users.js");
const orderRoute = require("./orders.js");



// Her rotayı ilgili yol altında kullanıyoruz
router.use("/categories", categoryRoute); // Burada categoryRoute dosyasını çağırıyoruz. Bu dosya da /create gibi bir endpoint'e sahiptir.
router.use("/auth", authRoute);  // Burada authRoute dosyasını çağırıyoruz. Bu dosya da /register gibi bir endpoint'e sahiptir.
router.use("/products", productRoute); // Burada productRoute dosyasını çağırıyoruz. Bu dosya da /create gibi bir endpoint'e sahiptir. 
router.use("/coupons", couponRoute); // Burada couponRoute dosyasını çağırıyoruz. Bu dosya da /create gibi bir endpoint'e sahiptir.
router.use("/users", userRoute); // Burada couponRoute dosyasını çağırıyoruz. Bu dosya da /create gibi bir endpoint'e sahiptir.
router.use("/orders", orderRoute);

module.exports = router;