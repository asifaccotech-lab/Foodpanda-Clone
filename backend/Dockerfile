# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy source
COPY src ./src
COPY .env.example .env.example

EXPOSE 4000

CMD ["npm", "run", "start"]