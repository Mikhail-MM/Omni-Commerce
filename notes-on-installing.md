This package - bcrypt and its dependency npm-gyp in particular - has some heavy dependencies. You need Python 2.7, 

Need to run:

npm install --global --production windows-build-tools

Then install npm-gyp globally

Only then can you install bcrypt, since it is built up with npm-gyp upon npm installation