# 🚀 Alliance Campus Map

Welcome to the **Alliance Campus Map** repository! This project combines a powerful backend (NestJS) and a modern frontend (Angular) for interactive campus map management and visualization.

---

## 🗂️ Project Structure

- `campusmap-server/` &nbsp;🟦 &mdash; **NestJS Backend**: REST APIs, ready for EC2 & AWS Lambda
- `campusmap-client/` &nbsp;🟩 &mdash; **Angular Frontend**: User interface, consumes backend APIs

---

## ⚙️ Requirements

- 🟢 Node.js 20+
- 📦 npm 9+
- 🐳 Docker _(optional, for container deployment)_
- ☁️ AWS CLI _(optional, for Lambda deployment)_

---

## 💻 Installation

### Backend

```bash
cd campusmap-server
npm install
```

### Frontend

```bash
cd campusmap-client
npm install
```

---

## 🏃 Local Development

### Backend

```bash
cd campusmap-server
npm run start:dev
```

### Frontend

```bash
cd campusmap-client
npm start
```

---

## 🧪 Testing

### Backend

```bash
cd campusmap-server
npm run test
```

### Frontend

```bash
cd campusmap-client
npm run test
```

---

## 🚢 Deployment

- 🖥️ **EC2**: Use the Dockerfile in `campusmap-server` to build and deploy the image.
- 🦾 **AWS Lambda**: Backend is ready to run as a Lambda function (containerized).
- 🌐 **Frontend**: Deploy to S3, CloudFront, or any static hosting service.

---

## 🔐 Environment Variables

Sensitive variables (e.g., database credentials) are managed via **AWS Secrets Manager** and injected into Lambda through the CI/CD pipeline.

---

## 🤖 CI/CD

Automated with **Jenkins**: runs tests, builds, and deployments for both backend and frontend.

---

## 💬 Contact

For support or questions, contact **Alliance Bioversity CIAT DevOps**.
