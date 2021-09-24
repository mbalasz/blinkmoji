# blinkenlight-emoji

## blinkmoji.com
To access via url add pi's ip to /etc/hosts followed by blinkmoji.com

## SSL Cert
Web Serial requires the connection to be secure.
For local network I created a self-signed certificate. That cert needs to be uploaded to all devices that want to be able to connect to the app via https://blinkmoji.com.

On mac, run `sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" <path-to-nginx-selfsigned.cer>`
