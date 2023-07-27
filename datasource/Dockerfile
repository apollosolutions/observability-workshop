FROM node:alpine

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install
ENV PORT 8888
CMD ["npm", "start"]