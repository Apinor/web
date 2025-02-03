# Security Policy for apinor/web

## Reporting a Vulnerability

🛡️ **We take security seriously!** If you discover a security vulnerability in our project, please report it responsibly.

### How to Report
- **Preferred Method**: Email [andhugelstad@gmail.com](mailto:andhugelstad@gmail.com) with details
- Alternative: Open a [GitHub Issue](https://github.com/apinor/web/issues) with the `[Security]` tag in the title

### What to Include
- A clear description of the vulnerability
- Steps to reproduce the issue
- Affected versions (if applicable)
- Suggested mitigation (optional but appreciated)

### Response Time
- We aim to acknowledge reports within **48 hours**
- Critical issues will be prioritized for resolution

---

## Supported Versions

✅ **Actively maintained branches** receive security updates:

| Branch     | Supported          | Status               |
|------------|--------------------|----------------------|
| `main`     | :white_check_mark: | Stable releases      |
| `Any other brances`  | :x:  | Not supported   |
| Legacy     | :x:                | No longer supported  |

---

## Security Updates

🔒 **Our update process:**
1. Regular dependency scanning using [Dependabot](https://github.com/dependabot)
2. Monthly security audits
3. Critical vulnerabilities patched within 72 hours of confirmation
4. All security updates documented in [CHANGELOG.md](CHANGELOG.md)

---

## Dependency Management

📦 **Third-party components:**
- All dependencies are pinned to specific versions
- Automated vulnerability scanning using GitHub Actions
- Regular dependency updates every 2 weeks

---

## Access Control

🔑 **Repository permissions:**
- Maintainers: 2 required for sensitive operations
- Least privilege principle enforced
- All contributors must enable 2FA
- API keys/tokens never committed to version control

---

## Incident Response

🚨 **Our response protocol:**
1. Immediate investigation of reported issues
2. Containment of affected systems
3. Root cause analysis
4. Patch deployment
5. Transparent communication to users

---

## Security Best Practices

💡 **For contributors:**
- Follow [OWASP Top 10](https://owasp.org/www-project-top-ten/) guidelines
- All code changes require security review
- Never hardcode credentials
- Use parameterized queries to prevent SQLi
- Validate all user input

---

## Disclaimer

❗ This policy may evolve as the project grows. Last updated: **2023-09-15**

---

[![Security Status](https://img.shields.io/badge/Security-Level_2-00CC00?style=flat-square)](https://github.com/apinor/web/security/policy)
