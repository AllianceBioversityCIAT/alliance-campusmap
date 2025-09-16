# Dockerfile for NestJS backend supporting both EC2 and AWS Lambda
# Multi-stage build for smaller image size

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .
RUN npm run build

# --- Lambda Runtime Interface Emulator (for local testing) ---
FROM public.ecr.aws/lambda/nodejs:20 AS lambda
WORKDIR /var/task
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/main-lambda.js ./main-lambda.js

# Lambda entrypoint
CMD ["main-lambda.handler"]

# --- EC2/Standard Node.js container ---
FROM node:20-alpine AS ec2
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]

# --- Final image selection ---
# Use --target lambda for Lambda, --target ec2 for EC2
