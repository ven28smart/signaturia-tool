
# Digital Signature Tool

A secure, enterprise-grade application for digitally signing PDF documents using either PKCS #12 certificates or HSM devices.

## Features

- PDF document signing with precise coordinate positioning
- Support for both PKCS #12 certificates and HSM integration
- Comprehensive audit logging of all signing activities
- Enterprise-grade security and scalability
- Clean, intuitive user interface

## Implementation Overview

This repository contains two components:

1. **Frontend Web Interface**: React-based UI for document upload, certificate management, and signing configuration
2. **Java Backend Service**: The core document signing engine (described in this README)

## Backend Implementation

The backend is a Java application that handles the core functionality of PDF signing. This is the component that clients will deploy on their servers.

### Technologies Used

- **Java 11+**: Core programming language
- **Spring Boot**: Application framework
- **iText 7/PDFBox**: PDF processing libraries
- **Bouncy Castle**: Cryptography provider
- **PKCS#11 Wrapper**: For HSM integration
- **Hibernate/JPA**: For audit logging persistence
- **JUnit 5**: For unit testing
- **Maven**: Build and dependency management

### Key Components

1. **SigningService**: Core service for document signing
2. **CertificateService**: Manages certificates and HSM connections
3. **AuditService**: Handles logging of signing activities
4. **SecurityConfig**: Security configurations and validations

### Installation Instructions

#### Prerequisites

- Java 11 or higher
- Maven 3.6 or higher
- Database (MySQL, PostgreSQL, or H2 for testing)

#### Deployment Steps

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/digital-signature-tool.git
   cd digital-signature-tool/backend
   ```

2. Configure application properties:
   Edit `src/main/resources/application.properties` to set:
   - Database connection details
   - HSM configuration (if applicable)
   - Audit log retention period
   - Other application settings

3. Build the application:
   ```
   mvn clean package
   ```

4. Run the application:
   ```
   java -jar target/digital-signature-tool-1.0.0.jar
   ```

5. The service will be available at `http://localhost:8080`

### Java Code Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── docsign/
│   │           ├── Application.java
│   │           ├── controller/
│   │           │   ├── SigningController.java
│   │           │   ├── CertificateController.java
│   │           │   └── AuditController.java
│   │           ├── service/
│   │           │   ├── SigningService.java
│   │           │   ├── CertificateService.java
│   │           │   └── AuditService.java
│   │           ├── model/
│   │           │   ├── SignatureRequest.java
│   │           │   ├── Certificate.java
│   │           │   └── AuditRecord.java
│   │           ├── repository/
│   │           │   ├── CertificateRepository.java
│   │           │   └── AuditRepository.java
│   │           └── util/
│   │               ├── SignatureUtil.java
│   │               ├── HSMUtil.java
│   │               └── SecurityUtil.java
│   └── resources/
│       ├── application.properties
│       └── templates/
└── test/
    └── java/
        └── com/
            └── docsign/
                ├── service/
                │   ├── SigningServiceTest.java
                │   ├── CertificateServiceTest.java
                │   └── AuditServiceTest.java
                └── util/
                    └── SignatureUtilTest.java
```

### API Endpoints

The backend exposes the following REST endpoints:

- **POST /api/sign**: Sign a document
- **GET /api/certificates**: List available certificates
- **POST /api/certificates**: Upload a new certificate
- **GET /api/audit**: Get audit logs
- **POST /api/hsm/connect**: Connect to an HSM

### Signing Process

1. Client uploads a PDF document
2. Client specifies signature positions (page, coordinates)
3. Backend validates the document
4. Backend signs the document using the selected certificate
5. Backend generates audit log entry
6. Signed document is returned to the client

### Security Considerations

- All private keys in PKCS #12 files are encrypted
- HSM integration keeps private keys secure in hardware
- All API endpoints require authentication
- Certificates are validated before use
- Password policies enforce strong credentials
- Audit logging captures all security-relevant events

### PDF Signing Implementation

The core signing functionality uses iText or PDFBox libraries:

```java
public class SigningService {
    public byte[] signPdf(byte[] pdfBytes, SignatureRequest request, Certificate cert) {
        // Initialize document
        PdfReader reader = new PdfReader(new ByteArrayInputStream(pdfBytes));
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfSigner signer = new PdfSigner(reader, outputStream, new StampingProperties());
        
        // Set signature parameters
        signer.setFieldName("Signature" + System.currentTimeMillis());
        
        // Create signature appearance
        Rectangle rect = new Rectangle(
            request.getX(), 
            request.getY(), 
            request.getX() + request.getWidth(), 
            request.getY() + request.getHeight()
        );
        PdfSignatureAppearance appearance = signer.getSignatureAppearance();
        appearance.setReason(request.getReason());
        appearance.setLocation(request.getLocation());
        appearance.setReuseAppearance(false);
        appearance.setPageRect(rect).setPageNumber(request.getPage());
        
        // Create signature
        IExternalSignature signature = createSignature(cert);
        
        // Sign the document
        signer.signDetached(signature, digestAlgorithm, provider, chain, null, null, null, 0, PdfSigner.CryptoStandard.CMS);
        
        return outputStream.toByteArray();
    }
    
    private IExternalSignature createSignature(Certificate cert) {
        if (cert.getType() == CertificateType.PKCS12) {
            // Use PKCS #12 certificate
            KeyStore keyStore = KeyStore.getInstance("PKCS12");
            keyStore.load(new FileInputStream(cert.getFilePath()), cert.getPassword().toCharArray());
            String alias = keyStore.aliases().nextElement();
            PrivateKey pk = (PrivateKey) keyStore.getKey(alias, cert.getPassword().toCharArray());
            return new PrivateKeySignature(pk, digestAlgorithm, provider);
        } else {
            // Use HSM
            return new HSMSignature(cert.getHsmConfig());
        }
    }
}
```

### Testing

The application includes comprehensive unit and integration tests. To run the tests:

```
mvn test
```

### Troubleshooting

Common issues and solutions:

1. **Certificate loading failures**:
   - Ensure the PKCS #12 file is valid
   - Verify the password is correct
   - Check file permissions

2. **HSM connection issues**:
   - Verify HSM device is properly connected
   - Check network connectivity to HSM
   - Ensure slot ID and PIN are correct

3. **PDF signing errors**:
   - Check PDF is not corrupted
   - Ensure signature coordinates are within page bounds
   - Verify certificate is valid and not expired

## License

This project is licensed under the MIT License.
