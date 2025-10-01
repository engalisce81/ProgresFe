# Build stage
FROM node:18 AS build
WORKDIR /app

# نسخ package files أولاً
COPY package*.json ./

# عرض إصدارات Node و npm للمساعدة في التشخيص
RUN echo "Node version:" && node --version
RUN echo "NPM version:" && npm --version

# تثبيت dependencies
RUN npm install

# نسخ باقي الملفات
COPY . .

# فحص بعض الملفات المهمة
RUN echo "Contents of package.json:" && cat package.json
RUN echo "Contents of angular.json:" && cat angular.json

# محاولة بناء التطبيق مع output مفصل
RUN npm run build --prod || (echo "Build failed, checking configurations..." && exit 1)

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
