# Online-learning-platform

## 📝 Table of Contents

- [Overview](#Overview)
- [Technologies used](#Technologies_used)
- [Getting Started](#Getting_Started)
- [Dockerization](#Dockerization_(Optional))
- [Testing](Testing_APIs_(using_Postman))
  
## 🧐 Overview

This backend application serves as the backend for learning platform. It provides APIs for managing courses, instructors, leads (learners), and comments.

## Technologies Used
- **Node.js**
- **Express.js**
- **Prisma ORM**
- **Docker**
- **PostgreSQL (Hosted on Aiven)**

## 🏁 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installation

### Prerequisites

- Node.js installed on your machine   
- Docker installed on your machine (optional, for Dockerized deployment)  
- Postman for testing APIs (recommended)

### Setup

#### 1. Clone the repository:

```
git clone github.com/desmond3th/learning-platform
```

#### 2. Navigate to the project directory:

```
cd <project_directory>
```

#### 3. Install dependencies:
```
npm install
```

#### 4. Set up environment variables:

Create a .env file configure the environment variables:
```
DATABASE_URL=your_aiven_postgres_uri
```

Replace ```your_aiven_postgres_uri``` with the service URI provided by Aiven for your PostgreSQL database.

#### 6. Configure Prisma

If getting error while configuring prisma, to map your data model to the database schema, you need to use this: 

```
npx prisma migrate dev --name init
```

#### 5. Start the server:

```
npm run dev
```

## 🐋 Dockerization (Optional)

If you prefer to deploy the application using Docker, follow these steps:

#### 1. Pull the Docker image:

```
docker pull saurabh3th/airtribe 
```

#### 2. Run the Docker container:

```
docker run -p 3000:3000 -e DATABASE_URL=<your_aiven_postgres_uri> saurabh3th/airtribe
```

Note : You can provide a custom name for the container using the --name option.

## 🔧 Testing APIs (using Postman)

After successfully setting up the application, you can test the APIs using Postman. Below are the steps to test a few sample APIs:

#### 1. Get Instructor Details API :

```
GET : http://localhost:PORT/api/v1/instructor/get-details/:email
```


Replace `PORT` with the port number where your application is running and `:email` with the email of the instructor you want to get details for.

#### 2. Create Course API :

```
POST http://localhost:PORT/api/v1/course/create
```

Request Body (JSON):
```
{
    "name": "Course Name",
    "maxSeats": 50,
    "startDate": "2024-03-08",
    "instructorId": "instructorId"
}
```

#### 3. Update Course Details API :
```
PATCH http://localhost:PORT/api/v1/course/update/:courseId
```

Replace ```:courseId``` with the ID of the course you want to update.


Request Body (JSON):
```
{
    "name": "Updated Course Name",
    "maxSeats": 60
}
```

#### 4. Course Registration API
```
POST http://localhost:PORT/api/v1/lead/register/:courseId
```
Replace ```:courseId``` with the ID of the course for which the user wants to register.

Request Body (JSON):
```
{
    "name": "User Name",
    "email": "user@example.com",
    "phoneNumber": "1234567890",
    "linkedInProfile": "https://linkedin.com/in/username"
}
```

Follow similar steps to test other APIs as well.

## ✍️ Author

- [@desmond3th](https://github.com/desmond3th)
