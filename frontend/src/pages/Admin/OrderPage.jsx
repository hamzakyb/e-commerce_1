import { Table, Spin, message, Button, Popconfirm, Modal } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";


const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Siparişleri getirme hatası");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Siparişleri getirme hatası:", error);
      message.error("Siparişleri getirirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`${apiUrl}/api/orders/${orderId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Sipariş detaylarını getirme hatası");
      }

      const data = await response.json();
      setOrderDetails(data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Sipariş detaylarını getirme hatası:", error);
      message.error("Sipariş detaylarını getirirken bir hata oluştu.");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${apiUrl}/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Siparişi silme hatası");
      }

      message.success("Sipariş başarıyla silindi.");
      fetchOrders(); // Sipariş listesini güncelle
    } catch (error) {
      console.error("Siparişi silme hatası:", error);
      message.error("Siparişi silerken bir hata oluştu.");
    }
  };

  const completeOrder = async (orderId) => {
    try {
      const response = await fetch(`${apiUrl}/api/orders/${orderId}/complete`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Siparişi tamamlama hatası");
      }

      message.success("Sipariş başarıyla tamamlandı.");
      fetchOrders(); // Sipariş listesini güncelle
    } catch (error) {
      console.error("Siparişi tamamlama hatası:", error);
      message.error("Siparişi tamamlarken bir hata oluştu.");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Sipariş Detayları", 20, 20);
    doc.text(`Kullanıcı E-posta: ${orderDetails.userEmail}`, 20, 30);
    doc.text(`Toplam Tutar: ${orderDetails.totalAmount.toFixed(2)} TL`, 20, 40);
    doc.text(`Sipariş Tarihi: ${new Date(orderDetails.createdAt).toLocaleString()}`, 20, 50);
    doc.text(`Durum: ${orderDetails.status === "completed" ? "Tamamlandı" : "Bekliyor"}`, 20, 60);

    let yOffset = 70;
    orderDetails.orderItems.forEach((item, index) => {
      doc.text(`Ürün ${index + 1}: ${item.productName}`, 20, yOffset);
      doc.text(`Miktar: ${item.quantity}`, 20, yOffset + 10);
      doc.text(`Birim Fiyat: ${item.productPrice} TL`, 20, yOffset + 20);
      yOffset += 30;
    });

    doc.save("siparis_detaylari.pdf");
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Kullanıcı E-posta",
      dataIndex: "userEmail",
      key: "userEmail",
      width: 200,
    },
    {
      title: "Toplam Tutar",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 100,
      render: (amount) => (amount ? `${amount.toFixed(2)} TL` : "N/A"),
    },
    {
      title: "Sipariş Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => (
        <>
          {status === "completed" ? (
            <span>
              <CheckCircleOutlined style={{ color: "green" }} /> Tamamlandı
            </span>
          ) : (
            <span>
              <ClockCircleOutlined style={{ color: "orange" }} /> Bekliyor
            </span>
          )}
        </>
      ),
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <div className="action-buttons">
          <Button type="primary" onClick={() => fetchOrderDetails(record._id)}>
            Detaylar
          </Button>
          <Popconfirm
            title="Siparişi Sil"
            description="Siparişi silmek istediğinizden emin misiniz?"
            okText="Evet"
            cancelText="Hayır"
            onConfirm={() => deleteOrder(record._id)}
          >
            <Button type="primary" danger>
              Sil
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            onClick={() => completeOrder(record._id)}
            disabled={record.status === "completed"}
          >
            Tamamlandı
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="table-container">
        <Table
          dataSource={orders}
          columns={columns}
          rowKey={(record) => record._id}
          scroll={{ x: '100%' }} // Tablo genişliğini sayfanın tamamını kaplayacak şekilde ayarladık
          className="custom-table"
        />
      </div>
      <Modal
        title="Sipariş Detayları"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="download" type="primary" onClick={downloadPDF}>
            PDF İndir
          </Button>,
        ]}
        width={1000} // Modal genişliğini ayarlayın
      >
        {orderDetails && (
          <div>
            <p><strong>Kullanıcı E-posta:</strong> {orderDetails.userEmail}</p>
            <p><strong>Toplam Tutar:</strong> {orderDetails.totalAmount.toFixed(2)} TL</p>
            <p><strong>Sipariş Tarihi:</strong> {new Date(orderDetails.createdAt).toLocaleString()}</p>
            <p><strong>Durum:</strong> {orderDetails.status === "completed" ? "Tamamlandı" : "Bekliyor"}</p>
            <Table
              columns={[
                { title: "Ürün Adı", dataIndex: "productName", key: "productName" },
                { title: "Miktar", dataIndex: "quantity", key: "quantity" },
                { title: "Birim Fiyat", dataIndex: "productPrice", key: "productPrice", render: (price) => `${price} TL` },
              ]}
              dataSource={orderDetails.orderItems}
              pagination={false}
              rowKey={(record) => record._id}
            />
          </div>
        )}
      </Modal>
    </Spin>
  );
};

export default OrderPage;