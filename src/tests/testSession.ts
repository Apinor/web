
import {generateSessionToken} from "../utils/generateSessionToken.ts"
import console from "../utils/logging.ts" 
import { validateSession } from "../utils/validateSession.ts";
import {saveSession} from "../utils/saveSession.ts";
const isValid = await validateSession("5d39c2656d166424598a47d83378829c8fa09ed8f7b6c9412e54d5d105893727");
if (isValid) {
    console.info("Access granted");
} else {
    // Deny access
}
const saved = await saveSession(generateSessionToken());
if (saved) {
    console.info("Session created successfully");
} else {
    console.error("Failed to create session");
}