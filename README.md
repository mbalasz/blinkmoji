# Blinkmoji

Interact with each other through emojis displayed on the blinkenlight.

It's an emoji "chat" web app where you can send any emoji to whoever is in the chat room (currently only one chat room per local network supported) - it'll display that emoji on their blinkenlight device.

**What is Blinkenlight?**

Check out fheinz@'s https://github.com/fheinz/Blinkenlights project. Blinkenlight is a LED display for pixel art animations.

This repo forks that project (specifically the `blinken.js` file).

## Requirements
The machine on which the web server is running has two main requirements to work properly:

### ImageMagick
Make sure you install (https://imagemagick.org/index.php) on the host machine.
`server.js` relies on the `convert` tool to convert the given emoji to a 16x16 gif.

### Emoji font
You need to have an emoji font installed. I found that `Noto Color Emoji` and `Noto Emoji` work pretty well.

Below is an example `.config/fontconfig/fonts.conf` that should work:
```
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig>
<alias>
  <family>monospace</family>
  <prefer>
    <family>DejaVu Sans Mono</family>
    <family>Noto Color Emoji</family>
    <family>Noto Emoji</family>
   </prefer>
 </alias>
</fontconfig>
```
## Usage
### Localhost
Assuming you followed the steps from the `Requirements` section above, run: `node server.js` and go to `localhost:3000` on `Chrome` (Firefox doesn't support Web Serial API).

### Multiple devices in a local network
This is slightly more tricky, because Web Serial API requires the connection to be secure.

After you follow the guide below you should be able to access the `https://blinkmoji.com` website from your local network and connect multiple blinkenlights devices to send messages to each other. 

#### Nginx
For this setup you need to host the Blinkmoji web app on Nginx. Make sure it's installed on your host machine.

Create a self-signed key and certificate pair with OpenSSL in a single command
```
$ sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt
```

Copy the repo file from `nginx/sites-available` to your nginx configuration `/etc/nginx/sites-available/`.

Enable the setup via a symbolic lin
```
cd /etc/nginx/sites-enabled/ 
ln -s /etc/nginx/sites-available/blinkmoji.com blinkmoji.com
```

Cope the repo file from `nginx/snippets/self-signed.conf` to your nginx configuration `/etc/nginx/snippets/`.

Test your nginx configuration with `sudo nginx -t`.
Restart nginx with `sudo systemctl restart nginx.service`.

#### Trust your self-signed certificate from all computers that you want to connect from. 
Every computer that wants to open blinkmoji.com needs to trust the certificate you generated from the previous step.

On mac, run `sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" <path-to-nginx-selfsigned.cer>`

#### blinkmoji.com
To access Blinkmoji via `https://blinkmoji.com` add the ip of your device that hosts the web app to `/etc/hosts`: 
```
# /etc/hosts
...
<blinkmoji-host-ip> blinkmoji.com
```