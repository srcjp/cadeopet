# Build stage
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Runtime stage
FROM nginx:stable-alpine
COPY --from=build /app/dist/cadeopet /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
