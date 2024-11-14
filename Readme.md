Here is the proper markdown conversion for your README:

```markdown
# ExamPoral

![Project Image](https://socialify.git.ci/AKsHaT123456A/ExamPortal/image?name=1&owner=1&pattern=Solid&theme=Dark)

**Developed a high-performance backend** for an online exam portal supporting over 500 students simultaneously, ensuring smooth real-time operations.

**Technologies:** Node.js, TypeScript, Bull (for job queuing), Redis (in-memory caching), WebSockets, Prometheus, and Grafana for efficient monitoring.

**Key Achievements:** 
- Achieved 99% caching efficiency with Redis.
- 90% uptime with load balancing.
- Real-time communication using WebSockets for seamless user interactions.

## 🚀 Demo

[Demo Link](https://csiexamm.vercel.app/)

## 🧐 Features

Here are some of the project’s best features:

- **Real-Time Exam Monitoring:** Utilized WebSockets to provide live updates for exam events, such as timer synchronization, question navigation, and answer submission, ensuring smooth interactions for over 500 concurrent users.
  
- **Scalable Queuing System:** Integrated Bull for efficient job queuing to handle time-sensitive tasks, like exam scoring and report generation, without disrupting the user experience.
  
- **High-Performance Caching:** Implemented Redis as an in-memory cache to store frequently accessed data, reducing response times and managing high traffic loads effectively.
  
- **Reliable Session Management:** Used Redis for session storage, allowing secure, scalable tracking of user sessions during exams and improving data consistency.
  
- **Comprehensive Performance Monitoring:** Set up Prometheus and Grafana for real-time monitoring of key metrics like server health, response times, and request loads, enabling quick issue detection and troubleshooting.
  
- **Load Balancing for High Availability:** Configured load balancing to maintain 90% uptime during peak periods, ensuring uninterrupted access for all users.
  
- **Robust Data Security:** Implemented authentication and authorization protocols, along with secure data handling practices, to ensure user data privacy and exam integrity.
  
- **Automated Reports and Analytics:** Automated exam report generation and analytics, enabling educators to quickly access student performance data post-exam.

## 🛠️ Installation Steps:

1. Add `.env`
2. Build the Docker image:

```bash
docker-compose up --build -d
```

## 💻 Built with

Technologies used in the project:

- Node.js
- WebSockets
- Bull
- Redis
- Prometheus
- Grafana
```

This markdown formatting will work well for a GitHub README.