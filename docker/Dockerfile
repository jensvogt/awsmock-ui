FROM node:21-alpine AS build

RUN apk update && apk add git

WORKDIR /app

# Build the docker build

RUN cd /app && \
    git clone https://github.com/jensvogt/awsmock-ui.git && \
    cd /app/awsmock-ui && \
    npm install --legacy-peer-deps && \
    npm run build --prod

# Serve Application using Nginx Server

FROM nginx:alpine

COPY --from=build /app/awsmock-ui/dist/awsmock-ui/browser /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
