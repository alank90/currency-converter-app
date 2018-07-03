# Single Page Application

This is a project demo that uses Vanilla JS to build a Single Page Application.

# Setup of debug for use in front-end scripts i.e, app.js
- First start the node server with npm start
- Choose "Launch Chrome against localhost" from drop down menu of debug screen
- Create a launch.json file similar to:
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:3000",
            "webRoot": "${workspaceFolder}/public"
        }
    ]
}

- where the index.html is stored in the /public directory and the url is to the node server
- Hit debug run arrow and wait for chrome to startup with index.html loaded...