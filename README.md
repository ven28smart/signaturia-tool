
# Digital Signature Tool

A secure, enterprise-grade application for digitally signing PDF documents using either PKCS #12 certificates or HSM devices.

## Features

- PDF document signing with precise coordinate positioning
- Support for both PKCS #12 certificates and HSM integration
- Comprehensive audit logging of all signing activities
- Enterprise-grade security and scalability
- Clean, intuitive user interface
- Built-in licensing system for commercial distribution
- Self-contained deployment with no external database dependencies

## Containerized Deployment

This application is designed to be deployed as a containerized application, making it easy to install and run on any server with Docker support.

### Docker Deployment Instructions (For Non-Technical Users)

#### Prerequisites

- A server or computer with Docker installed
  - For Windows/Mac: Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
  - For Linux: Install Docker using your package manager or [follow these instructions](https://docs.docker.com/engine/install/)

#### Step 1: Download the Container Image

We'll provide you with a Docker image file or instructions to pull it from our private Docker registry.

If you received a `.tar` file:

1. Open a terminal or command prompt
2. Navigate to the folder containing the image file
3. Run: `docker load -i digital-signature-tool.tar`

If you need to pull from our registry:

1. Open a terminal or command prompt
2. Run: `docker login registry.yourcompany.com` (use the credentials we provided)
3. Run: `docker pull registry.yourcompany.com/digital-signature-tool:latest`

#### Step 2: Run the Container

To start the application, run:

```
docker run -d -p 8080:80 -v signature-data:/app/data --name signature-tool digital-signature-tool:latest
```

This command:
- Runs the application in the background (`-d`)
- Maps port 8080 on your server to the application's internal port (`-p 8080:80`)
- Creates a persistent volume for data storage (`-v signature-data:/app/data`)
- Names the container "signature-tool" for easy reference

#### Step 3: Access the Application

Open your web browser and navigate to:

```
http://your-server-ip:8080
```

Replace `your-server-ip` with your server's IP address or hostname.

#### Managing the Container

- To stop the application: `docker stop signature-tool`
- To start it again: `docker start signature-tool`
- To view logs: `docker logs signature-tool`
- To completely remove it: `docker rm -f signature-tool`

### Advanced Deployment Options

#### Running on HTTPS

If you want to use HTTPS, you'll need to set up a reverse proxy like Nginx or use a load balancer. Alternatively, you can mount your SSL certificates into the container:

```
docker run -d -p 443:443 -v /path/to/certs:/certs -e USE_HTTPS=true -e SSL_CERT=/certs/cert.pem -e SSL_KEY=/certs/key.pem -v signature-data:/app/data --name signature-tool digital-signature-tool:latest
```

#### Data Persistence

The application stores all data in the `/app/data` directory inside the container, which is mapped to a Docker volume. This ensures your data persists even if the container is removed.

To back up your data:

```
docker run --rm -v signature-data:/data -v $(pwd):/backup alpine tar -czf /backup/signature-data-backup.tar.gz /data
```

To restore from backup:

```
docker run --rm -v signature-data:/data -v $(pwd):/backup alpine tar -xzf /backup/signature-data-backup.tar.gz -C /
```

## Licensing System Documentation

### Overview

The Digital Signature Tool uses a built-in licensing system to control access to features and enforce usage limits. Each license key includes:

1. An expiration date
2. A document signing limit
3. Access to specific features

### How License Keys Work

License keys are generated using a secure algorithm that encodes:
- Organization ID (to identify the customer)
- Expiry date (when the license becomes invalid)
- Document limit (maximum number of documents that can be signed)

The encoded information is then encrypted and formatted as a human-readable key.

### Generating License Keys (For Administrators)

As an administrator, you can generate license keys in the Settings > License tab of the application. You'll need to specify:

1. The Organization ID (a unique identifier for your customer)
2. License duration (in days)
3. Document limit (maximum number of documents the customer can sign)

Once these parameters are set, click "Generate Key" to create a license key that can be provided to your customer.

### Implementing License Keys (For Customers)

Customers activate their license by:

1. Accessing the application in their browser
2. Clicking on the "License" panel on the right side of the screen
3. Clicking "Activate New License"
4. Entering the provided license key
5. Clicking "Activate License"

### Security Measures

The licensing system includes several security measures to prevent tampering:

1. License keys are cryptographically signed to prevent forgery
2. The application validates the license on each startup and for each critical operation
3. License information is stored securely in local storage with tamper detection
4. Usage counts are maintained even if the application is uninstalled and reinstalled

In a production environment, additional security measures would be implemented, such as hardware binding and secure license storage.

### License Monitoring

Users can monitor their license usage in the application:
- Current document count vs. total allowed
- Days remaining before license expiration
- License status (active, expired, etc.)

## Implementation Overview

This application consists of:

1. **Frontend Web Interface**: React-based UI for document upload, certificate management, and signing configuration
2. **Embedded Backend**: Java-based document signing engine running in the same container

### Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Java, Spring Boot
- **PDF Processing**: iText 7/PDFBox
- **Cryptography**: Bouncy Castle
- **Storage**: Embedded H2 database
- **Container**: Docker

## License

This project is licensed under a commercial license. Unauthorized distribution is prohibited.
