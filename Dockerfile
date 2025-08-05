# =============================
# 1️⃣ Build Stage
# =============================
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# List contents for debugging (optional, remove in prod)
RUN echo "Listing /app contents:" && ls -la /app
RUN echo "Listing /app/build contents:" && ls -la /app/build

# =============================
# 2️⃣ Production Stage
# =============================
FROM nginx:alpine

# Install gettext for envsubst (to replace env variables in nginx conf)
RUN apk add --no-cache gettext

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx template config
COPY nginx.template.conf /etc/nginx/conf.d/nginx.template.conf

# Copy React build output from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Replace ${PORT} in template with environment variable and start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]