# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Debug: عرض محتويات dist
RUN ls -la /app/dist/

# Production stage
FROM nginx:alpine
# انسخ محتويات مجلد Acadmy بدلاً من dist مباشرة
COPY --from=build /app/dist/Acadmy/ /usr/share/nginx/html

# Debug: التحقق من الملفات في nginx
RUN ls -la /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]