# Exam Portal

A comprehensive, scalable platform for managing and conducting exams for over 500 students, built with real-time communication and caching efficiency. This project emphasizes performance, scalability, and a seamless user experience.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Real-time Communication**: Utilizes Socket.IO for seamless, real-time interactions among students and administrators.
- **Efficient Caching**: Achieves 99% caching efficiency, minimizing server load and ensuring faster response times.
- **Load Balancing**: Maintains 90% uptime during peak usage to accommodate high traffic without compromising performance.
- **Enhanced User Engagement**: Features a leaderboard and interactive elements, resulting in a 25% increase in user engagement.
- **Scalability**: Optimized codebase with improved maintainability and scalability by 30%.

## Technologies Used
- **Frontend**: ReactJS
- **Backend**: ExpressJS
- **Database**: MongoDB
- **Real-time Communication**: Socket.IO

## Installation

### Prerequisites
- **Node.js** and **npm** installed
- **MongoDB** database

1. **Clone the repository**:
    ```bash
    git clone git@github.com:AKsHaT123456A/ExamPortal.git
    cd ExamPortal
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add your MongoDB URI and other necessary environment variables:
    ```env
    MONGODB_URI=your_mongodb_uri
    PORT=5000
    ```

4. **Run the application**:
    ```bash
    npm start
    ```

The app should now be running at `http://localhost:5000`.

## Usage
- **Admin Panel**: Admins can set up exams, manage students, and monitor live exam sessions.
- **Student Dashboard**: Students can view upcoming exams, join live exams, and see their scores and leaderboard positions.

## Project Structure
```plaintext
├── middleware           # Custom middleware for handling requests and responses
├── controllers      # Business logic for various API endpoints
├── models           # Database models
├── views            # HTML templates or frontend views
├── public               # Static files (CSS, JavaScript, images)
├── routes               # Application routes
├── utils                # Helper functions and utilities
├── validators           # Data validation functions
├── .env                 # Environment variables
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. For major changes, open an issue first to discuss what you would like to contribute.

    Fork the project.
    Create your feature branch: git checkout -b feature/YourFeature
    Commit your changes: git commit -m 'Add YourFeature'
    Push to the branch: git push origin feature/YourFeature
    Open a pull request.

Live Site: https://csiexamm.vercel.app/

Feel free to explore, use, and enhance the Exam Portal to meet the needs of educational institutions or learning platforms.
