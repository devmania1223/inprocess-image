FROM node:12.19.0-alpine
RUN mkdir -p /app
WORKDIR /app
COPY start.sh ./

RUN mkdir -p /inprocess-backend
WORKDIR /app/inprocess-backend
COPY package*.json ./
RUN npm install
COPY . ./

WORKDIR /app
RUN mv inprocess-backend/inprocess-frontend .

WORKDIR /app/inprocess-frontend
RUN npm install
RUN npm run build

WORKDIR /app
CMD ["sh", "start.sh"]