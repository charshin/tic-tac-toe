FROM node:12.13.0-alpine

ARG GIT_COMMIT_HASH

# ! DO NOT use this approach for secrets since they will be visible in the image
ENV COMMIT_HASH=${GIT_COMMIT_HASH}

# Create app directory
WORKDIR /app

# Install app dependencies
# Make use of docker layer cache
# i.e. only re-install node_modules if package-lock.json changes
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .
RUN npm run postinstall

EXPOSE 7000

# Bundle app source for client usage
# TODO Consider using initContainer
CMD npm run $(case "$env" in "development") echo "build:dev" ;; "test") echo "build:test" ;; *) echo "build" ;; esac) \
  # Start server
  && npm run $(case "$env" in "development") echo "serve:dev" ;; "test") echo "serve:test" ;; *) echo "serve" ;; esac)