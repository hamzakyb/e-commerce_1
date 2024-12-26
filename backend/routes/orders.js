const express = require("express");
const Order = require("../models/Order.js");
const router = express.Router();

// Yeni bir sipariş oluşturma
router.post("/", async (req, res) => {
  const { userId, orderItems, cargoFee, deliveryDate, paymentMethod } = req.body;

  // Kullanıcı bilgisi kontrolü
  if (!userId) {
    return res.status(400).json({ error: "Kullanıcı ID eksik." });
  }

  // Toplam tutarı hesapla
  const totalAmount = orderItems.reduce((total, item) => total + item.subTotal, 0) + cargoFee;

  try {
    // Yeni sipariş oluştur
    const newOrder = new Order({
      userId,
      orderItems,
      cargoFee,
      totalAmount,
      deliveryDate,
      paymentMethod,
    });

    // Siparişi veritabanına kaydet
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Sipariş oluşturma hatası:", error);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

// Tüm siparişleri getirme
router.get("/", async (req, res) => {
    try {
      const orders = await Order.find()
        .populate({
          path: 'userId',
          model: 'User',
          select: 'email', // Sadece email alanını çekiyoruz
        })
        .populate({
          path: 'orderItems.productId', // Eğer 'productId' doğruysa
          model: 'Product',
          select: 'name', // Sadece name alanını çekiyoruz
        });
  
      const formattedOrders = orders.map(order => ({
        ...order.toObject(),
        userEmail: order.userId ? order.userId.email : "Unknown", // userId null ise "Unknown" olarak ayarla
        orderItems: order.orderItems.map(item => ({
          ...item,
          productName: item.productId ? item.productId.name : "Unknown", // productId null ise "Unknown" olarak ayarla
        })),
      }));
  
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error("Siparişleri getirme hatası:", error.message);
      res.status(500).json({ error: "Sunucu hatası." });
    }
  });

  // Belirli bir siparişi silme
router.delete("/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const deletedOrder = await Order.findByIdAndDelete(orderId);
  
      if (!deletedOrder) {
        return res.status(404).json({ error: "Sipariş bulunamadı." });
      }
  
      res.status(200).json({ message: "Sipariş başarıyla silindi." });
    } catch (error) {
      console.error("Sipariş silme hatası:", error.message);
      res.status(500).json({ error: "Sunucu hatası." });
    }
  });

  // Sipariş durumunu güncelleme
router.patch("/:orderId/complete", async (req, res) => {
    try {
      const { orderId } = req.params;
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: "completed" },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ error: "Sipariş bulunamadı." });
      }
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Sipariş güncelleme hatası:", error.message);
      res.status(500).json({ error: "Sunucu hatası." });
    }
  });

  // Belirli bir siparişin detaylarını getirme
router.get("/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId)
        .populate({
          path: 'userId',
          model: 'User',
          select: 'email', // Sadece email alanını çekiyoruz
        })
        .populate({
          path: 'orderItems.productId',
          model: 'Product',
          select: 'name price', // Ürün adı ve fiyatını çekiyoruz
        });
  
      if (!order) {
        return res.status(404).json({ error: "Sipariş bulunamadı." });
      }
  
      const formattedOrder = {
        ...order.toObject(),
        userEmail: order.userId ? order.userId.email : "Unknown",
        orderItems: order.orderItems.map(item => ({
          ...item,
          productName: item.productId ? item.productId.name : "Unknown",
          productPrice: item.productId ? item.productId.price : "Unknown",
        })),
      };
  
      res.status(200).json(formattedOrder);
    } catch (error) {
      console.error("Sipariş detaylarını getirme hatası:", error.message);
      res.status(500).json({ error: "Sunucu hatası." });
    }
  });

module.exports = router;