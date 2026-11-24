# Example API

The example namespace provides various test endpoints for testing purposes.

## /api/ok

Accepts any verb, always responds with plain text `ok` and status 200.

## /api/json

When called with `GET` return static json payload.

When called with `POST/PUT/PATCH` accepts a json payload, echos payload back in response.
400 if payload is not valid json

## /api/multipart

Accepts `POST/PUT/PATCH` and a `forms/multipart` payload.
Return a list of keys in payload and status 200 if valid.

## /api/long-path/\*

Accepts any verb and any length of path, e.g. `/api/long-path/this/can/be/quite/long`.
Returns the path after /api/long-path/ and status 200.

## /api/headers

Accepts any verb. Returns a response with status 200 and various custom headers set.

```
x-custom-header=test123
X-SOME-VALUE=SomeValue
```

## /api/error/$code

Accepts any verb. Code must be a valid http code between 100 and 599.
Returns a response with status set to the code set in path.
