upstream blinkmoji_domain {
    server 127.0.0.1:3000;
    keepalive 8;
}

# the nginx server instance
server {
    listen 443 ssl;
    server_name blinkmoji.com www.blinkmoji.com;
    access_log /var/log/nginx/blinkmoji.com.log;
    include snippets/self-signed.conf;

    # pass the request to the node.js server with the correct headers
    # and much more can be added, see nginx config options
    location / {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header X-NginX-Proxy true;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";

      proxy_pass http://blinkmoji_domain/;
      proxy_redirect off;
    }
 }
