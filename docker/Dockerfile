FROM node:18-alpine AS build

RUN apk update && apk add git

WORKDIR /app

RUN cd /app && \
    git clone https://github.com/jensvogt/awsmock-ui.git && \
    cd /app/awsmock-ui && \
    npm install && \
    npm run build

# Serve Application using Nginx Server

FROM nginx:alpine

COPY --from=build /app/awsmock-ui/dist/awsmock-ui/browser /usr/share/nginx/html

EXPOSE 80