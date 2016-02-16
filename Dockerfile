FROM    centos:centos6

# Enable Extra Packages for Enterprise Linux (EPEL) for CentOS
RUN     yum install -y epel-release
# Install Node.js and npm
RUN     yum install -y nodejs npm git wkhtmltopdf

# Install app dependencies
COPY package.json /src/package.json
RUN cd /src; npm install

# install bower
RUN npm install --global bower
COPY bower.json /src/bower.json
COPY .bowerrc /src/.bowerrc
RUN git config --global url."https://".insteadOf git://
RUN cd /src; bower update

# Bundle app source
COPY . /src

EXPOSE  9000
CMD ["node", "/src/server.js"]
