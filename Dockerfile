FROM node:18-alpine as BUILD_IMAGE

ARG ARG_HOST

ENV BE_HOST=$ARG_HOST

WORKDIR /app

COPY . .

RUN npm install

RUN echo $BE_HOST

RUN API_URL=$BE_HOST npm run build

FROM nginx:alpine

COPY --from=BUILD_IMAGE /app/dist/my-list/browser /usr/share/nginx/html

EXPOSE 8080

COPY nginx.conf /etc/nginx/conf.d/default.conf