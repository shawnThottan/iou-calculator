FROM node:14-slim as build-image

RUN apt-get update || : && apt-get install python -y
RUN apt-get install build-essential -y

WORKDIR /app
COPY . /app
RUN yarn
RUN yarn build

FROM nginx:1.21.0-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx
COPY --from=build-image app/build /data/www/html