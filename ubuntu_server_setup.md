# Server Setup

## Nginx + SSL + python

### Image

#### ubuntu 20.04.6 lts (focal fossa) - minimal

### Setup steps

1. Update the package lists:

```bash
sudo apt update
```

2. Install ufw (Uncomplicated Firewall):

```bash
sudo apt install ufw
```

3. Enable ufw:

```bash
sudo ufw enable
```

4. Allow SSH connections (optional):

```bash
sudo ufw allow OpenSSH
```

5. Allow HTTP and HTTPS (optional):

```bash
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'

ufw allow 80,443/tcp
```

6. Verify ufw status:

```bash
sudo ufw status verbose
```

7. Install Nginx:

```bash
sudo apt install nginx
```

8. Start Nginx:

```bash
sudo systemctl start nginx
```

9. Enable Nginx on boot:

```bash
sudo systemctl enable nginx
```

10. Verify Nginx status (access server IP/domain in a web browser)

11. Create a separate user:

```bash
sudo adduser <<USERNAME>>
sudo visudo

    <<USERNAME>> ALL=(ALL:ALL) ALL
    ctrl-x
    Y


ssh as this ssh <<USERNAME>>@<<YOURDOMAIN>>
```

12. Download Miniconda installer script (replace <LINK-TO-LATEST-INSTALLER> with the actual link):

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
```

13. Run the Miniconda installer script (replace <MINICONDA-INSTALLER> with the actual filename):

```bash
bash <MINICONDA-INSTALLER>
```

14. Follow the prompts in the installer to complete the installation

15. Close the terminal and open a new one

16. Verify Miniconda installation:

```bash
conda --version
```

17. disable ssh access for user root

```bash
  sudo nano /etc/ssh/sshd_config
  PermitRootLogin no
  sudo systemctl restart sshd

  sudo systemctl restart sshd
  sudo nano /etc/ssh/sshd_config
  PermitRootLogin no

  # on local machine
  ssh-keygen
  ssh-copy-id <<USERNAME>>@<<YOURDOMAIN>>
```

### BONUS SSL-CERT

```bash
  sudo apt update
  sudo apt install python3-certbot-nginx
  sudo certbot --nginx -d <<YOURDOMAIN>>
  sudo certbot renew --dry-run
```

```bash
Congratulations, all renewals succeeded. The following certs have been renewed:
  /etc/letsencrypt/live/<<YOURDOMAIN>>/fullchain.pem (success)
** DRY RUN: simulating 'certbot renew' close to cert expiry
**          (The test certificates above have not been saved.)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

IMPORTANT NOTES:
 - Your account credentials have been saved in your Certbot
   configuration directory at /etc/letsencrypt. You should make a
   secure backup of this folder now. This configuration directory will
   also contain certificates and private keys obtained by Certbot so
   making regular backups of this folder is ideal.

--------
```

### BONUS QUICK USER AUTH

```bash
sudo apt-get install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd <<AUSERNAME>>
New password: <<APASSWORD>>
Re-type new password: <<APASSWORD>>
```    

### BONUS RUN fastapi as a SERVICE

```bash
sudo nano /etc/nginx/sites-enabled/default 
```

```nginx
# add auth and proxy route

server {

        ...

        location / {
            auth_basic "Preview Area";
            auth_basic_user_file <<YOUTPATH>>/.htpasswd;
            try_files $uri $uri/ =404;
        }

        location /api {
            auth_basic off;
            include proxy_params;
            proxy_pass http://localhost:8000;
        }

}
```

```bash
    sudo nginx -t
    sudo systemctl restart nginx
```

`sudo nano /etc/systemd/system/interview.service`

```service
# /etc/systemd/system/interview.service
    [Unit]
    Description=Gunicorn instance to serve the interview-api
    After=network.target

    [Service]
    User=www-data        
    Group=www-data
    WorkingDirectory=<YOURPATH>/interview
    Environment="PATH=<YOURPATH>/venv/bin/"
    ExecStart=<YOURPATH>/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker api:app

    [Install]
    WantedBy=multi-user.target
```

```bash
    systemctl daemon-reload
    sudo systemctl enable interview
    sudo systemctl start interview
    sudo systemctl status interview
    sudo systemctl stop interview
```

`sudo nano /etc/nginx/sites-enabled/default` 

```bash
...
server {
        # SSL configuration
        listen 443 ssl;
        ssl_certificate /etc/letsencrypt/live/<<YOURDOMAIN>>/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/<<YOURDOMAIN>>/privkey.pem; # managed by Certbot

        gzip           off;

        root           <<INSTALLATIONPATH>>interview/public;
        index          index.html;
        server_name    <<YOURDOMAIN>>;

        location / {
            auth_basic "Preview Area";
            auth_basic_user_file /etc/nginx/.htpasswd;
            try_files $uri $uri/ =404;
        }

        location /api {
            auth_basic off;
            include proxy_params;
            proxy_pass http://localhost:8000;
        }
}

...

```

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### BONUS HARDENING

* Use SSH key-based authentication: Instead of relying solely on passwords, you can set up SSH key-based authentication. This involves generating a key pair (public and private key) and configuring your server to accept the public key for authentication. This method is more secure as it eliminates the risk of brute-force password attacks. You can find detailed instructions on how to set up SSH key-based authentication in the official documentation or various online tutorials.

* Disable password-based authentication: Once you have set up SSH key-based authentication and confirmed that it's working properly, you can disable password-based authentication altogether. This ensures that only clients with the correct private key can authenticate to your server. To disable password authentication, find the

* PasswordAuthentication line in the /etc/ssh/sshd_config file and set it to no.

* Change the SSH default port: By default, SSH listens on port 22. Changing the default port can help reduce the number of unauthorized login attempts. You can modify the Port directive in the /etc/ssh/sshd_config file to specify a different port (e.g., a high port number above 1024).

* Limit SSH access to specific IP addresses: To further restrict SSH access, you can configure your firewall (such as ufw) to allow SSH connections only from specific IP addresses or IP ranges. This prevents unauthorized access attempts from other sources. Use the ufw command to add rules that allow SSH access from trusted IP addresses only.

* Enable SSH login notifications: You can set up SSH login notifications to receive email alerts whenever someone successfully logs in to your server via SSH. This helps you monitor and identify any unauthorized access attempts. There are various tools and scripts available for this purpose, such as "sshesame" or custom scripts that utilize the /etc/profile file.

## Author

Copyleft /-right IN5O 2023.

