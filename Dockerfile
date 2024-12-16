# Build stage for frontend
FROM node:22-alpine as frontend-builder

# Create app directory
WORKDIR /usr/src/app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source to the current directory, which should be /usr/src/app
COPY frontend/ .

# Build with environment variables
ENV VITE_FILESTACK_API_KEY=${VITE_FILESTACK_API_KEY}
ENV VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
ENV VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
ENV VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
ENV VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
ENV VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
ENV NODE_ENV=production
ENV VITE_PROD_BASE_URL=${VITE_PROD_BASE_URL}

RUN npm run build

# Production stage
FROM node:22-alpine as production

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy backend source
COPY server.js ./
COPY controllers/ ./controllers/

# Create public/dist directory and copy built frontend
RUN mkdir -p public/dist
COPY --from=frontend-builder /usr/src/app/frontend/dist/ ./public/dist/

# Set production environment and disable HTTPS enforcement for local development
ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]
