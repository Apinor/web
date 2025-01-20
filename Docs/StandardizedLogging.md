# Standardized Logging for the Project

Logging is an essential practice for maintaining a reliable and debuggable codebase. By adhering to standardized logging conventions, we ensure consistent, meaningful, and actionable log messages that simplify debugging, monitoring, and understanding the application.

## Why Standardized Logging?

- **Consistency**: Ensures log messages are structured and predictable.
- **Debugging**: Simplifies identifying and resolving issues.
- **Monitoring**: Helps track application behavior and performance.

---

## Logging Levels

We use four distinct logging levels to categorize log messages based on their severity and purpose.

# Logging Levels and Best Practices

## 1. INFO
**Purpose:** Captures general information about the system's normal operations.  
**Use Case:** Tracks events that do not indicate problems but are helpful for auditing and understanding the system's flow.  

**Examples:**
- `INFO: User 'john_doe' logged in successfully.`
- `INFO: Daily report generated at 3:00 AM.`
- `INFO: Application started on port 8080.`

---

## 2. WARN
**Purpose:** Flags abnormal situations that could indicate potential problems in the future.  
**Use Case:** Early indicators of issues that may require investigation but do not disrupt the system.  

**Examples:**
- `WARN: Disk space is below 10%.`
- `WARN: Attempted to fetch data from an unavailable API endpoint.`
- `WARN: Deprecated function 'getOldData' used in module X.`

---

## 3. ERROR
**Purpose:** Logs unrecoverable errors that affect specific operations but not the entire application.  
**Use Case:** Highlights issues that require developer attention.  

**Examples:**
- `ERROR: Failed to write data to database.`
- `ERROR: Payment transaction ID 12345 returned 'Invalid Card Details'.`
- `ERROR: NullPointerException encountered in UserService.java at line 45.`

---

## 4. FATAL
**Purpose:** Logs critical errors that cause the application to crash or become unusable.  
**Use Case:** Highlights system-wide failures requiring immediate attention.  

**Examples:**
- `FATAL: Unable to load configuration file; application shutting down.`
- `FATAL: Out of memory. System halted.`
- `FATAL: Failed to bind to port 443. Exiting program.`

---

## Logging Best Practices
1. **Be Descriptive:** Include relevant context in log messages, such as user IDs, operations, or module names.
2. **Avoid Noise:** Log only necessary information to prevent clutter and maintain clarity.
3. **Use Levels Appropriately:** Match the log level to the severity and purpose of the event.
4. **Review Regularly:** Periodically review and test logs to ensure they remain useful and clear.

