# IF2150-2024-K02-G12-NEST

**Nest** is an application designed as a tool for managing projects and tasks, catering to users who want to plan and organize their daily activities in a more structured and efficient manner. This software includes the management of various projects and their associated tasks, equipped with features designed to help users better manage their time and workload. The software focuses on three main aspects:
 - **Project management**
 - **Task management and notifications**
 - **Monitoring**

## Getting Started

**Prerequisites**
Ensure you have the following installed:
- Node.js : [link to install Node](https://nodejs.org/en)
- npm or yarn : [link to npm](https://www.npmjs.com/get-npm) | [link to yarn](https://classic.yarnpkg.com/en/docs/install/)

**Installation**
1. **Clone the repository:**

```
git clone https://github.com/bevindav/IF2150-2024-K02-G12-NEST.git
cd IF2150-2024-K02-G12-NEST
```
2. **Install dependencies:**
```
npm install
# or 
yarn install
```
3. **Setup environment variables:**
```
npx prisma migrate dev
```
<br/>

**Run the Local Server**

To start the develompant server, run:
```
npm run dev
# or
yarn dev
```

**Run the App**

To start running the app, run:
```
npm run electron
# or
yarn electron
```

## Implemented Modules
List of all the modules that is being implemented and the main feature interface

| Module Name           | Implemented By |
|-----------------------|----------------|
| ProyekController      | Farrel         |
| FormProyek            | Farrel         |
| ProyekDisplay         | Farrel         |
| TugasController       | Ahsan          |
| FormTugas             | Ahsan          |
| TugasDisplay          | Bevinda        |
| KomentarController    | Raka           |
| KomentarDisplay       | Raka           |
| FormKomentar          | Bevinda        |
| NotifikasiController  | Aliya          |
| NotifikasiDisplay     | Aliya          |

### Project Management
Create and manage projects with deadlines and track progress efficiently.
<p align="center">
  <img src="src\doc\ProyekDisplay3.png" alt="Add New Project" width="450"/>
  <img src="src\doc\FormProyek4.png" alt="Project Management" width="450"/>
</p>

### Task Management
Create and manage tasks within projects.
<p align="center">
  <img src="src\doc\TugasDisplay2.png" alt="Add New Task" width="450"/>
  <img src="src\doc\TugasController.png" alt="Task Dashboard" width="450"/>
</p>

### Notification
The notification system ensures users stay updated with their project and task deadlines. It provides real-time alerts and reminders to help users track their progress effectively.
<p align="center">
  <img src="src\doc\NotifikasiDisplay.png" alt="Notification Popup" width="450"/>
  <img src="src\doc\NotifikasiDisplay1.png" alt="Notification Menu" width="450"/>
</p>

### Comments
The comment system enables addtional comment on tasks. Users can add, view, and manage comments for better communication and clarity.
<p align="center">  
  <img src="src\doc\FormKomentar.png" alt="Comment Management" width="450"/>
  <img src="src\doc\KomentarDisplay1.png" alt="Comment Display" width="450"/>
</p>


## Database
Table of Database with its attribute and type.

### Table: Project
| Attribute       | Type          | Description                                       |
|-----------------|---------------|---------------------------------------------------|
| `id`           | Int           | Primary key, auto-incremented.                    |
| `title`        | String        | Title of the project.                             |
| `description`  | String        | Description of the project.                       |
| `deadline`     | DateTime      | Deadline for the project.                         |
| `tasks`        | Task[]        | List of associated tasks.                         |
| `notifications`| Notification[]| List of notifications related to the project.     |
| `createdAt`    | DateTime      | Timestamp when the project was created, defaults to `now()`. |

### Table: Task
| Attribute       | Type          | Description                                       |
|-----------------|---------------|---------------------------------------------------|
| `id`           | Int           | Primary key, auto-incremented.                    |
| `title`        | String        | Title of the task.                                |
| `description`  | String        | Description of the task.                          |
| `deadline`     | DateTime      | Deadline for the task.                            |
| `completed`    | Boolean       | Whether the task is completed, defaults to `false`.|
| `projectId`    | Int           | Foreign key linking to the `Project` table.       |
| `project`      | Project       | Relationship to the `Project` table.              |
| `comments`     | Comment[]     | List of comments associated with the task.        |
| `notifications`| Notification[]| Notifications related to the task.                |
| `createdAt`    | DateTime      | Timestamp when the task was created, defaults to `now()`. |

### Table: Comment
| Attribute       | Type          | Description                                       |
|-----------------|---------------|---------------------------------------------------|
| `id`           | Int           | Primary key, auto-incremented.                    |
| `text`         | String        | Text of the comment.                              |
| `taskId`       | Int           | Foreign key linking to the `Task` table.          |
| `task`         | Task          | Relationship to the `Task` table.                 |

### Table: Notification
| Attribute       | Type          | Description                                       |
|-----------------|---------------|---------------------------------------------------|
| `id`           | Int           | Primary key, auto-incremented.                    |
| `message`      | String        | Notification message.                             |
| `type`         | String        | Notification type: "project" or "task".           |
| `timeLeft`     | String        | Remaining time (e.g., "1 day left", "5 hours left").|
| `projectId`    | Int?          | Optional: Foreign key linking to the `Project` table.|
| `project`      | Project?      | Optional relationship to the `Project` table.     |
| `taskId`       | Int?          | Optional: Foreign key linking to the `Task` table.|
| `task`         | Task?         | Optional relationship to the `Task` table.        |
| `createdAt`    | DateTime      | Timestamp when the notification was created, defaults to `now()`.|
| `read`         | Boolean       | Whether the notification has been read, defaults to `false`. |

