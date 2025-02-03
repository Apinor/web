# Standardized Logging for the Project

Logging is an essential practice for maintaining a reliable and debuggable codebase. By adhering to standardized logging conventions, we ensure consistent, meaningful, and actionable log messages that simplify debugging, monitoring, and understanding the application.

## Why Standardized Logging?
- **Consistency**: Ensures log messages are structured and predictable.
- **Debugging**: Simplifies identifying and resolving issues.
- **Monitoring**: Helps track application behavior and performance.

## Logging Levels
We use four distinct logging levels to categorize log messages based on their severity and purpose.

### Logging Levels and Best Practices

---
1. **INFO**
   - **Purpose**: Captures general information about the system's normal operations.
   - **Use Case**: Tracks events that do not indicate problems but are helpful for auditing and understanding the system's flow.

   #### Examples:
   - `INFO: User 'john_doe' logged in successfully.`
     - **Context**: A user has logged in, this is useful for auditing and tracking user actions.
   - `INFO: Daily report generated at 3:00 AM.`
     - **Context**: Indicates the completion of a scheduled task, important for monitoring system activities.
   - `INFO: Application started on port 8080.`
     - **Context**: Marks the start of the application, important for understanding when the application was initialized and ready for use.
   - `INFO: Cache cleared successfully after 24 hours of inactivity.`
     - **Context**: This helps track cache maintenance activities.
   - `INFO: User 'jane_doe' updated her profile settings.`
     - **Context**: Logs changes to user profiles, useful for auditing purposes.

---
2. **WARN**
   - **Purpose**: Flags abnormal situations that could indicate potential problems in the future.
   - **Use Case**: Early indicators of issues that may require investigation but do not disrupt the system.

   #### Examples:
   - `WARN: Disk space is below 10%.`
     - **Context**: Alerts administrators about a disk space issue that could lead to performance degradation or application failures.
   - `WARN: Attempted to fetch data from an unavailable API endpoint.`
     - **Context**: Indicates that a non-critical API failed temporarily but can be retried or investigated later.
   - `WARN: Deprecated function 'getOldData' used in module X.`
     - **Context**: Alerts developers about using an outdated function that will eventually be removed, prompting them to refactor the code.
   - `WARN: High memory usage detected (90%) on server 'webserver01'.`
     - **Context**: Indicates a potential performance issue, allowing administrators to investigate before it leads to an out-of-memory error.
   - `WARN: Failed to connect to external analytics service, retrying in 10 seconds.`
     - **Context**: Alerts that an external service is temporarily unavailable, without immediately impacting user experience.

---
3. **ERROR**
   - **Purpose**: Logs unrecoverable errors that affect specific operations but not the entire application.
   - **Use Case**: Highlights issues that require developer attention.

   #### Examples:
   - `ERROR: Failed to write data to database 'orders_db'.`
     - **Context**: A critical operation (writing to the database) failed, and the application should not proceed without fixing the issue.
   - `ERROR: Payment transaction ID 12345 returned 'Invalid Card Details'.`
     - **Context**: Captures failed payment attempts, useful for tracking and debugging failed transactions.
   - `ERROR: NullPointerException encountered in UserService.java at line 45.`
     - **Context**: A specific error occurred within the code, and developers need to investigate the exact location of the issue.
   - `ERROR: Missing required configuration key 'API_KEY' in environment variables.`
     - **Context**: Flags a configuration issue that prevents certain operations from functioning.
   - `ERROR: Unable to process user registration, 'email' field is null.`
     - **Context**: Provides clear insight into a failed registration attempt due to a missing required field.

---
4. **FATAL**
   - **Purpose**: Logs critical errors that cause the application to crash or become unusable.
   - **Use Case**: Highlights system-wide failures requiring immediate attention.

   #### Examples:
   - `FATAL: Unable to load configuration file; application shutting down.`
     - **Context**: A crucial configuration file is missing or corrupt, leading to a full application shutdown.
   - `FATAL: Out of memory. System halted.`
     - **Context**: The application has run out of memory, and the system cannot function until resolved.
   - `FATAL: Failed to bind to port 443. Exiting program.`
     - **Context**: A network binding error occurs on a critical port, preventing the application from starting up.
   - `FATAL: Database connection failed; cannot continue without database access.`
     - **Context**: The application depends on a database and cannot function without it, leading to an immediate failure.
   - `FATAL: Unrecoverable error in core module 'AuthenticationService'. Application terminating.`
     - **Context**: A critical error in the authentication service requires the application to shut down.

---

### Logging Best Practices
- **Be Descriptive**: Include relevant context in log messages, such as user IDs, operation details, or module names. This makes logs more actionable and helps developers quickly understand the situation.
   - Example: `INFO: User 'john_doe' updated their shipping address to '123 Main St'.`
   
- **Avoid Noise**: Log only necessary information to prevent clutter and maintain clarity. Avoid logging too much trivial data that does not aid in debugging or monitoring.
   - Avoid logging: `INFO: User clicked on button A.`
   - Instead, focus on critical actions like: `INFO: User 'john_doe' initiated password reset request.`

- **Use Levels Appropriately**: Match the log level to the severity and purpose of the event. Don't log critical errors with a low severity level (e.g., logging fatal errors as `INFO`).
   - `ERROR: Failed to process payment` should not be logged as `INFO`.

- **Review Regularly**: Periodically review and test logs to ensure they remain useful and clear. Remove unnecessary logs and ensure that error logs are actionable and provide clear context for resolution.
   - **Periodic log review**: Ensure logs are following best practices and do not include unnecessary information or outdated log messages that no longer apply to the current codebase.

---

By following these logging best practices and using standardized levels, you’ll ensure that your logs are meaningful, actionable, and easy to monitor.
