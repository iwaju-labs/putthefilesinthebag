# -------- BUILD STAGE --------
FROM node:20-alpine AS builder

# Install build dependencies (FFmpeg and fonts for watermarks)
RUN apk add --no-cache ffmpeg ttf-dejavu

# Set working directory
WORKDIR /app

# Install dependencies including devDependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build args for environment variables needed at build time
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Set environment variables for build
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Build Next.js app
RUN npm run build


# -------- RUNTIME STAGE --------
FROM node:20-alpine AS runner

# Install FFmpeg and fonts for runtime
RUN apk add --no-cache ffmpeg ttf-dejavu

WORKDIR /app

# Copy only what we need for production runtime
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Ensure production mode
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]