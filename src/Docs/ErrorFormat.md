# Error formatting

This page contains examples and error formatting rules

---

## All errors should be one of the three bottom logging types:

(Fatal, Error or WARN)

- <span style="color:blue">INFO</span>: Significant and noteworthy business events.
- <span style="color:Khaki">WARN</span>: Abnormal situations that may indicate future problems.
- <span style="color:red">ERROR</span>: Unrecoverable errors that affect a specific operation.
- <span style="color:MediumVioletRed">FATAL</span>: Unrecoverable errors that affect the entire program.
## All errors will be returned in this format:


```typescript
    return Result.fail({
      code: 500,
      message: "Database error occurred",
      level: ErrorLevel.Fatal,
      details: error,
    });
```

---

## Examples of the different fields:

### Code

Code, indicates which error code has been encountered this will be used for grouping errors and easier understanding the root of the problem. 

```typescript
      code: 500,
      code: 400,
      code: 404,
      code: 200,
```

Code can be changed to any of the web error codes, in which case they mean the same

---

### Message

Message, indicates the unique situation/location where the error occured. This will be customized to every function.


```typescript
      message: "Database error occurred",
      message: "IO could not find image file",
      message: "No student found with the specified ID",
```
---

### Level

Level, indicates which of the log levels this error occured at, so here wee need to pick one of the following:

<span style="color:blue">INFO</span>
<span style="color:Khaki">WARN</span>
<span style="color:red">ERROR</span>
<span style="color:MediumVioletRed">FATAL</span>
---

---

Example:

```typescript
      level: ErrorLevel.Fatal,
      level: ErrorLevel.WARN,
      level: ErrorLevel.Error,
```