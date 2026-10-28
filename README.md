# 🌻 Sunfield Fortuna

**A digital platform supporting a more inclusive and accessible community.**

Sunfield Fortuna is a charity website designed to connect people with the organisation, showcase its team and initiatives, and make it easier for supporters to get involved through donations, wishlists, and communication.

The project combines a user-friendly frontend with backend functionality for authentication, contact messages, team information, and wishlist management.

## 🌐 Live Deployments

| Platform | Link |
|---|---|
| 🌍 Original live website | [sunfieldfortuna.co.za](https://www.sunfieldfortuna.co.za) |
| ☁️ AWS Amplify deployment | [View the AWS website](https://main.d1b3g1xzr5dr4a.amplifyapp.com) |

Both deployments are available online. The AWS frontend currently communicates with the existing Azure backend.

## ✨ Features

- **Responsive website** — an accessible, welcoming online presence for the organisation.
- **User authentication** — account registration and login.
- **Team information** — showcase the people behind Sunfield Fortuna.
- **Wishlist functionality** — support engagement with the organisation's wishlist.
- **Contact form** — provide a way for visitors to get in touch.
- **User dashboard** — access user-related functionality.
- **Admin functionality** — manage relevant administrative features.
- **Backend API** — connect frontend functionality to persistent data.

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript
- Vite
- CSS and web technologies

### Backend
- Node.js
- Express.js
- REST API endpoints
- Cookie-based authentication
- CORS configuration

### Database
- MySQL / MariaDB

### Deployment & Hosting
- **AWS Amplify** — frontend hosting and deployment.
- **Microsoft Azure App Service** — existing Node.js backend hosting.
- **GitHub** — source control and backend deployment workflow.

## 🏗️ Architecture

The project uses a frontend-and-backend architecture:

1. The React frontend is built and deployed through AWS Amplify.
2. The frontend sends API requests to the Node.js backend hosted on Azure.
3. The backend handles authentication, application logic, and database operations.
4. The existing database remains in place, preserving the application's stored data.

This setup demonstrates how frontend hosting and backend services can run on separate cloud platforms.

## 🚀 Deployment

### AWS Amplify

The frontend is deployed through AWS Amplify and built using the project's Vite build configuration.

### Microsoft Azure

The Node.js backend remains hosted on Azure App Service. GitHub commits trigger the existing deployment workflow.

The backend is configured to allow requests from the AWS Amplify frontend, enabling cross-origin API communication and cookie-based authentication.

## 🎯 Project Goals

Sunfield Fortuna aims to provide a practical digital presence for a charity organisation while demonstrating full-stack web development, database integration, authentication, and cloud deployment.

The project also explores deploying a frontend and backend across different cloud platforms while retaining an existing database and backend infrastructure.

## 👩‍💻 Development

To run the frontend locally, navigate to the frontend directory and install the dependencies:

```bash
cd frontend
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

The backend has its own dependencies and environment configuration. Follow the existing backend setup instructions and configure the required environment variables before running it locally.

**Security note:** Never commit `.env` files, database credentials, authentication secrets, or other sensitive configuration to GitHub.

## 🌱 Future Improvements

- Continue refining the responsive user experience.
- Improve validation and error handling.
- Expand testing across frontend and backend functionality.
- Continue monitoring deployment reliability and cross-origin authentication.
- Further improve accessibility and maintainability.

---

**Built with care for Sunfield Fortuna.** 🌻

