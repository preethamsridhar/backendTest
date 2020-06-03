- First run `npm install` to install the dependencies.
- `npm start` will start the project at localhost on port 8080
- `npm test` will run all the test suits.

### Public end-point
- End-point - `/login`
    - Parameters
        - `user_email`
        - `user_password`
    - This end-point will return a JWT token
### Protected end-point
- End-point - `/jsonPatch`
    - Parameters
        - `json` - This will contain a json object
        - `patch` - This will contain an array of json patch object.
    - headers
        - `x-auth-token` - This will contain JWT token for authorization.
    - This end-point will return a patched json object.
    
- End-point - `/thumbnail`
    - Parameters
        - `imgUrl` - This will contain URL of a public image.
    - headers
        - `x-auth-token` - This will contain JWT token for authorization.
    - This end-point will return resized image.