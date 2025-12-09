# Security Policy

## Recent Security Updates (December 2025)

### Critical Vulnerabilities Fixed

On December 9, 2025, we addressed 35+ high-severity vulnerabilities by updating key dependencies:

#### Critical RCE Vulnerabilities (CVSS 10.0)
- **CVE-2025-66478**: Next.js React Server Components RCE vulnerability
  - Fixed by updating Next.js from 15.2.4 to **15.5.7**
- **CVE-2025-55182**: React Flight protocol RCE vulnerability
  - Fixed by updating React from 19.0.0 to **19.2.1**
  - Fixed by updating React-DOM from 19.0.0 to **19.2.1**

#### Additional Security Updates
- **PostCSS**: Updated from 8.5.0 to 8.5.6 (ReDoS vulnerability fixes)
- **autoprefixer**: Updated from 10.4.20 to 10.4.22
- **marked**: Updated from 16.3.0 to 17.0.1 (XSS vulnerability fixes)
- **jsonwebtoken**: Updated from 9.0.2 to 9.0.3 (authentication bypass fixes)
- **js-yaml**: Updated from 4.1.0 to 4.1.1
- **glob**: Updated from 11.0.3 to 13.0.0
- **@vercel/analytics**: Updated from 1.3.1 to 1.6.1
- **Removed deprecated packages**: crypto, fs, path (now using Node.js built-ins)

### Impact
These updates fix critical remote code execution vulnerabilities that could allow attackers to execute arbitrary code on the server. All production deployments should update immediately.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by:
1. Opening a private security advisory on GitHub
2. Emailing the repository maintainers

We aim to respond to security reports within 48 hours and will keep you updated on the progress of addressing any confirmed vulnerabilities.
