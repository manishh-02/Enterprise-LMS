# 🚀 Enterprise Learning Management System (LMS)

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

A comprehensive, full-stack Enterprise Learning Management System built with the MERN stack. Designed to streamline corporate training, this platform features a robust Role-Based Access Control (RBAC) system, secure media storage using AWS S3, and a seamless single-server production deployment.

## 🌐 Live Demo
Experience the platform live: **[https://enterprise-lms-1xxp.onrender.com]**

> **Test the Employee Portal (Read-Only Mode)**
> - **Email:** `[employee@gmail.com]`
> - **Password:** `[1234]`
> 
> *(Note: For security purposes, Admin, HR, and Instructor access are restricted in the public demo. I would be happy to demonstrate full CRUD capabilities during an interview.)*

---

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Highly secure architecture with distinct roles—Admin, HR, Instructor, and Employee.
* **Cloud Media Storage:** Direct integration with **AWS S3** for secure and scalable uploading of course videos and thumbnails.
* **Secure Authentication:** Stateless authentication using **JSON Web Tokens (JWT)** and encrypted passwords.
* **Unified Architecture:** Optimized production build serving both the React frontend and Node.js backend from a single Express server.
* **Responsive UI:** Modern, clean, and intuitive dashboard built with React and Vite.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React.js (via Vite)
* **Styling:** CSS / Tailwind (Adjust if you used Tailwind)
* **Icons:** React Icons

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Authentication:** JWT (jsonwebtoken)
* **File Handling:** Multer & Multer-S3

### Database & Cloud
* **Database:** MongoDB (via Mongoose)
* **Cloud Storage:** Amazon S3 (AWS)
* **Hosting/Deployment:** Render

---

## ⚙️ Environment Variables

To run this project locally, create a `.env` file in the `backend` directory and add the following variables:

| Variable Name | Description |
| :--- | :--- |
| `PORT` | Port for the local server (e.g., 5000) |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for generating JSON Web Tokens |
| `AWS_REGION` | Your AWS S3 Bucket Region |
| `AWS_ACCESS_KEY_ID` | Your AWS IAM Access Key |
| `AWS_SECRET_ACCESS_KEY` | Your AWS IAM Secret Key |
| `AWS_S3_BUCKET_NAME` | The name of your S3 bucket |

---

### 💻 Local Installation & Setup

**1. Clone the repository:**
```bash
git clone [https://github.com/yourusername/Enterprise-LMS.git](https://github.com/yourusername/Enterprise-LMS.git)

```

**2. Install Backend Dependencies:**
```bash
cd Enterprise-LMS/backend
npm install
```

**3. Install Frontend Dependencies:**
```bash
cd ../frontend
npm install
```

**4. Run the Application locally:**
*Open two separate terminals to run both servers simultaneously.*

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev  # or use: node server.js
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---

## 🚀 Production Deployment Strategy

This application is optimized for a **Single-Server Deployment** on Render. 
The build script automatically compiles the Vite-React frontend into static assets within the `dist` folder. The Node.js backend then serves these static files alongside the API routes, eliminating the need for separate hosting services and preventing CORS issues! 🎉

**Build Command:**
```bash
npm install && cd ../frontend && npm install && npm run build
```

**Start Command:**
```bash
node server.js
```

---

## 👨‍💻 Meet the Developer

**[MANISH KUMAR MISHRA]** A Full-Stack Developer building scalable web applications.

* 🌐 **LinkedIn:** www.linkedin.com/in/manishhh-mishra
* 💻 **GitHub:** https://github.com/manishh-02<img width="1883" height="846" alt="Screenshot 2026-06-20 131723" src="https://github.com/user-attachments/assets/2400d23d-0608-4cda-9316-108abeb53cef" />

* ✉️ **Email:** mishra.manish4763@gmail.com

> **Did you like this project?** > *If you found this repository helpful or interesting, please don't forget to drop a ⭐! It keeps developers motivated!*

