import React from 'react';

interface NotificationCardProps {
  type: string; // Tipe data untuk "type" (misalnya: "Project" atau "Task")
  title: string; // Teks judul
  deadline: string; // Teks deadline
}

const NotificationCard: React.FC<NotificationCardProps> = ({ type, title, deadline }) => {
    // Warna untuk Project dan Task
    const isProject = type === "Project";
    const color = isProject ? "#5f5af6" : "#5f5af6"; // Sama-sama biru untuk logo
  
    return (
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '15px',
        backgroundColor: '#fff',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '10px',
        width: '300px',
      }}>
        {/* Header dengan ikon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '10px',
        }}>
          {/* Ikon untuk Project dan Task */}
          <span style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'transparent', // Transparan untuk lingkaran kosong
            border: `5px solid ${color}`, // Border biru
            boxShadow: '0 0 0 5px white inset', // Bagian tengah putih
            marginRight: '10px',
          }}></span>
          {/* Teks tipe */}
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: color, // Warna teks biru
          }}>
            {type}
          </span>
        </div>
  
        {/* Konten teks */}
        <div>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 5px 0',
          }}>
            {title}
          </h4>
          <p style={{
            fontSize: '12px',
            color: '#666',
            margin: 0,
          }}>
            {deadline}
          </p>
        </div>
      </div>
    );
  };
  
export default NotificationCard;
