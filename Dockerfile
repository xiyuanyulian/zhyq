# STEP 1: Build
FROM node:12.22-alpine3.10 as builder
LABEL maintainer="zj <zj199098@126.com>"

WORKDIR /usr/src/app
COPY package.json ./
RUN npm i
COPY . .
RUN npm run build

# STEP 2: Package
FROM nginx
LABEL maintainer="zj <zj199098@126.com>"

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html/console
CMD [ "nginx", "-g", "daemon off;"]
