# Task Manager API — DevOps Project

A simple Node.js REST API deployed using a full CI/CD pipeline with Jenkins, Docker, and Kubernetes.

---

## Tech Stack

- **App** — Node.js + Express
- **CI/CD** — Jenkins
- **Containerization** — Docker
- **Orchestration** — Kubernetes
- **Registry** — Docker Hub

---

## Project Structure

```
task-manager/
├── app/                  # Node.js application
│   ├── server.js
│   ├── app.js
│   ├── routes/
│   ├── store/
│   └── tests/
├── Dockerfile
├── Jenkinsfile
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
└── README.md
```

---

## Application

A Task Manager REST API with in-memory storage.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create a task |
| GET | `/tasks/:id` | Get a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/health` | Liveness probe |
| GET | `/ready` | Readiness probe |

---

## CI/CD Pipeline

Jenkins pipeline stages:

```
Install → Test → Build → Push → Deploy
```

1. **Install** — installs Node.js dependencies
2. **Test** — runs 14 Jest tests with coverage
3. **Build** — builds Docker image
4. **Push** — pushes image to Docker Hub
5. **Deploy** — applies Kubernetes manifests

---

## Kubernetes

- 2 replicas running
- Liveness probe on `/health`
- Readiness probe on `/ready`
- Exposed via NodePort on port `30007`

---

## Run Locally

```bash
cd app/
npm install
npm start
# API running on http://localhost:3000
```

```bash
# Run tests
npm test
```

---

## Docker

```bash
docker build -t task-manager .
docker run -p 3000:3000 task-manager
```

---

## Author

**Chaitanya Patil**  
[GitHub](https://github.com/Chaitanyaa1211) | [Docker Hub](https://hub.docker.com/u/chaitanyaaaa)
