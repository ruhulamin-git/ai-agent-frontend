# AI Builder Authentication Setup

## Bearer Token Configuration

The AI Builder module uses Bearer token authentication for all API requests.

### Configuration

1. **Environment Variable** (Deprecated)
   The AI Builder previously supported a static token via `.env`, but the app now uses the main login flow (cookies). If you still need to test with a static token, you can set:

   ```
   NEXT_PUBLIC_BEARER_TOKEN=your_token_here  # deprecated
   ```

2. **Default Token** (Deprecated)
   The default hardcoded token has been removed from `store/constant.js`. The module relies on app authentication via cookies now.

### How It Works

1. **Automatic Header Injection**

   - Every API request automatically includes: `Authorization: Bearer <token>`
   - Configured in `api/client.js` request interceptor

2. **Token Management**

   - Use `tokenManager.js` utilities to manage tokens:

     ```javascript
     import { setToken, getToken, clearToken } from "@/modules/ai-builder/utils/tokenManager";

     // Update token
     setToken("new_token_here");

     // Get current token
     const token = getToken();

     // Clear token
     clearToken();
     ```

3. **Token Persistence**
   - Tokens are stored in localStorage as `ai_builder_token`
   - Automatically loaded on page refresh

### API Request Example

All requests through `apiClient` automatically include the token:

```javascript
import apiClient from "@/modules/ai-builder/api/client";

// Token is automatically added to headers
const response = await apiClient.get("/nodes");
```

### Debugging

Check console logs for token status:

- `API Request: GET /api/v1/nodes with token: Yes`

### Current Token

The current configured token is:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5MGZjYjM2LWVmNWEtNGFiYy1hZWE0LTQ1OGZiOGQwNDNhNyIsImlhdCI6MTc3ODY0MzE5MSwiZXhwIjoxNzc5MjQ3OTkxfQ.xsu76sRqx_n0jOGczlgqi_51SzN_ikkMEkwwFUXMVig
```

**Note:** This token expires on a specific date. Update it when needed.
