'use client';

import React, { useState } from 'react';

interface TaskCardProps {
  title: string;
  description: string;
  date: string;
  commentsCount: number;
  isCompleted: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, description, date, commentsCount, isCompleted }) => {
  const [completed, setCompleted] = useState(isCompleted);
  const [showOptions, setShowOptions] = useState(false);

  const handleMarkAsDone = () => {
    setCompleted(!completed);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '300px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}
    >
      <div
        onClick={toggleOptions}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '1.5px solid #d3d3d3',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '16px', color: '#333', marginBottom: '10px' }}>...</span>
      </div>

      {showOptions && (
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '8px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '8px',
            fontSize: '12px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <button
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '4px',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#333',
            }}
            onClick={() => {}}
          >
            Edit
          </button>
          <button
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '4px',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#FF7979',
            }}
            onClick={() => {}}
          >
            Delete
          </button>
        </div>
      )}

      <h3
        style={{
          fontSize: '13px',
          color: '#333',
          fontWeight: '750',
          textDecoration: completed ? 'line-through' : 'none',
        }}
      >
        Tugas Title
        {title}
      </h3>

      <p
        style={{
          margin: '0 0 12px',
          fontSize: '12px',
          color: '#999',
          fontWeight: '200',
        }}
      >
        Tugas Description
        {description}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            backgroundColor: '#FF79791A',
            color: '#FF7979',
            fontWeight: '550',
            borderRadius: '17px',
            padding: '5px 16px',
            fontSize: '12px',
            display: 'block',
            marginBottom: '24px',
          }}
        >
          ini tanggal {date}
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
            color: '#666',
          }}
        >
          <span
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '16px',
              fontSize: '12px',
              color: '#666',
            }}
          >
            logo+count {commentsCount}
          </span>
        </span>
      </div>

      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          onClick={handleMarkAsDone}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: completed ? '#FFA048' : '#ddd',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'absolute',
            bottom: '13.5px',
            right: '93.5px',
          }}
        >
          {completed && (
            <span
              style={{
                color: 'white',
                fontSize: '8px',
              }}
            >
              ✔
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: '11px',
            color: completed ? '#FFA048' : '#666',
            marginLeft: '8px',
            cursor: 'pointer',
            position: 'absolute',
            bottom: '11px',
            right: '18px',
          }}
        >
          Mark as Done
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
