# EMR and HIS system for transgender health nucleus
## Installation
This process assumes that you are using Ubuntu 16.04 on server machine.
The server of the system is executed on Node.js. We started with its installation.
```Shell
$ cd ~
$ curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
$ sudo bash nodesource_setup.sh
$ sudo apt-get install nodejs
$ sudo apt-get install build-essential
```
Update NPM to use recent packages made available and used in the project.
```Shell
$ npm config get prefix
$ mkdir ~/.npm-global
$ npm config set prefix '~/.npm-global'
$ sudo nano ~/.profile
```
Add this line.
```Shell
export PATH=~/.npm-global/bin:$PATH
```
Back on the terminal (Ctrl + o and Ctrl + x).
```Shell
$ source ~/.profile
$ npm install npm@latest -g

```
In some cases NPM may not update globally, due to a pointer failure between directories.
You can try this to solve.
```Shell
$ curl -L https://www.npmjs.com/install.sh | sudo sh
```
The system uses MongoDB as the database, let's install it as a service.
```Shell
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
$ echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
$ sudo nano /etc/systemd/system/mongodb.service
```
In the file insert
```Shell
[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target

[Service]
User=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf

[Install]
WantedBy=multi-user.target
```
Back on the terminal (Ctrl + o and Ctrl + x).
```Shell
$ sudo systemctl start mongodb
$ sudo systemctl enable mongodb
$ sudo mongo
$ use Farina
$ exit
```
With MongoDB, Node and NPM correctly installed and updated, we need a node process manager, so that the system functions as a service.
```Shell
$ npm install -g pm2
$ pm2 startup systemd
```
A new command will be generated, run as directed by PM2.
Copy the system server folder to the server (FTP).
In the destination folder I run the system server inside the PM2.
```Shell
$ pm2 start npm --name "farinaserver" -- run start
```
The system client does not depend on settings on the server.
But eventually you may wish to provide both through the same machine.
For this nginx can be useful.
**Note:  The entire system works over the https protocol**
Installing nginx
```Shell
$ sudo apt-get install nginx
$ sudo systemctl stop nginx
```
Installing ssl certificates for nginx
```Shell
$ sudo apt-get install letsencrypt
$ sudo letsencrypt certonly --standalone
```
After following the instructions on the screen to create the certificate.
Resume the nginx configuration.
```Shell
$ sudo nano /etc/nginx/sites-available/default
```
This is sample for configuration. Adjust according to your settings.
```Shell
server {
  listen 443;

  root /var/www/html;
  index index.html index.htm;

  server_name {SERVER NAME example.com};

  ssl on;
  ssl_certificate /etc/letsencrypt/live/{SERVER NAME example.com}/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/{SERVER NAME example.com}/privkey.pem;
  ssl_session_timeout 30m;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_prefer_server_ciphers on;
  ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

  location / {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_pass https://127.0.0.1:4430/;
  }

  location /pepserver/ {
    proxy_pass https://127.0.0.1:3060/;
  }
}
```
Starting nginx for testing
```Shell
$ sudo nginx -t
$ sudo systemctl start nginx
```
(If you want to use apache to serve the client application, you can find a support guide at: [Apache HTTPS](https://www.digitalocean.com/community/tutorials/how-to-create-a-ssl-certificate-on-apache-for-ubuntu-14-04))

To end import the default database.

**Problems, details and tips that can help:**
* Ensure that the server address variable in the client application is pointing to the correct location.

## Screnns
## Coming soon