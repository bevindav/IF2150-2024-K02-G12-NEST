import React from 'react'
import NotificationCard from '@/components/NotificationCard'

const page: React.FC = () => {
    return (
      <div>
        <NotificationCard
          type="Project"
          title="Project's Name"
          deadline="3 days left until the deadline!"
        />
        <NotificationCard
          type="Task"
          title="Task's Name in Project's Name"
          deadline="3 days left until the deadline!"
        />
      </div>
    );
  };
  
export default page
