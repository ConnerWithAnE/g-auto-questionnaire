FROM node:18.19.1

# Install the latest Chrome dev package and necessary fonts and libraries
RUN apt-get update && \
    apt-get install -y wget gnupg && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] https://dl-ssl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 dbus dbus-x11 --no-install-recommends && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd -r apify && \
    useradd -rm -g apify -G audio,video apify

# Determine the path of the installed Google Chrome
RUN which google-chrome-stable || true


# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./


# Install dependencies
RUN npm install

# Copy the Next.js app files to the container
COPY .next/ ./.next/
COPY pages/ ./pages/
COPY public/ ./public/
COPY next.config.mjs ./next.config.mjs

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
 PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "run", "start"]