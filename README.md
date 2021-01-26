# Project-OP Client
## Production use
This is  the webclient for Project-OP (OP stands for online poker).

To build this client for production use, you need Node-JS.
The client must be built first, then the server.

The build script (see angular.json) outputs the project into `../projectop_server/static`. Thus, the project structure must be as follows (Both projects must be located in  the same folder).
```
.
|── projectop_server/
|   |── static/
|       |── (this is the compiled projectop_webclient location)
|── projectop_webclient/
```

To compile the webclient, use this command:
```
npm run build
```
If you encounter problems due to automatic version incrementation, try
```
npm run build-nv
```

Before this can work, remember to use 
```
npm install
```
to install all dependencies.


## Testing
To test the client, run
```
npm start
```