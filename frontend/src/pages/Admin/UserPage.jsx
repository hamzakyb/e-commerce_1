import { Button, Popconfirm, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";

const UserPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role", // veritabanındaki ismin aynısı!!!
      key: "role", // veritabanındaki ismin aynısı!!!
    },
    {
      title: "İşlemler",
      dataIndex: "actions", // veritabanındaki ismin aynısı!!!
      key: "actions", // veritabanındaki ismin aynısı!!!
      render: (_, record) => (
        <Popconfirm
          title="Kullanıcıyı Sil"
          description="Kullanıcıyı silmek istediğinizden  emin misiniz?"
          okText="Evet"
          cancelText="Hayır"
          onConfirm={() => deleteUser(record.email)}
        >
          <Button type="primary" danger>
            Sil
          </Button>
        </Popconfirm>
      ),
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (imgSrc) => (
        <img
          src={imgSrc}
          alt="Avatar"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
          }}
        />
      ),
    },
  ];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/users`);

      if (response.ok) {
        const data = await response.json();
        setDataSource(data);
      } else {
        message.error("Veri getirme başarısız.");
      }
    } catch (error) {
      console.log("Veri hatası:", error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);
 
  const deleteUser = async (userEmail) => {
    try {
      const response = await fetch(`${apiUrl}/api/users/${userEmail}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Kullanıcı başarıyla silindi.");
        // Kullanıcıyı listeden silerken de güncelleme yapıyoruz.
        fetchUsers();
      } else {
        message.error("Silme işlemi başarısız.");
      }
    } catch (error) {
      console.log("Silme  hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={(record) => record._id}
      loading={loading}
    />
  );
};

export default UserPage;
