[![Build Status](https://travis-ci.org/joethe/totallyNot3601Lab5.svg?branch=master)](https://travis-ci.org/joethe/totallyNot3601Lab5)
# CSCI 3601 Lab #5 - Processing JSON data from Mongo

During this lab you will complete a small project for a hypothetical customer, using all of the tools you have learned in
other labs. The new thing being introduced in this lab is the Yeoman generator. You will use it to manage laying out your project's basic directory structure and boilerplate details such as routing.

There is no "LABTASKS.md" for this lab, as you will be expected to follow the same agile practices that you will be using on
your final project.

## Setup
- Fork this repository (so that it is easy for us to keep track of your work).
- 
- Use the generator to generate your project (see below).
- Make sure your applications is called "student".
- Move the ``seed.js`` file into your config directory. 
- **Make sure that your .gitignore contains the .idea, /server/config/environment/production.js, etc. Use past .gitignore for reference.**
- Once you have checked your .gitignore, add all the appropriate generated files to the repsoitory and commit. 
- You will be using a local test database (like in Lab 4). You will also be given read-only access to the customer's database for testing.

## Using the generator to create your project
We are using yeoman generator: http://yeoman.io/generators/
Specifically, the angular-fullstack generator: https://github.com/DaftMonk/generator-angular-fullstack

This generator will set up a new project for you with a directory structure quite similar to the one you've been using
in previous labs, and will make it easier to manage adding new things to your project.

Run: ``yo`` in your project's main directory...
- Choose generator: ``Angular Fullstack``
- Choose Scripting Language: ``Javascript``
- Choose markup Language: ``HTML``
- Choose Stylesheet Language: ``CSS``
- Choose Router: ``uiRouter``
- Use Bootstrap = ``yes``
- Include UI Bootstrap = ``yes``
- Use mongoDB with Mongoose = ``yes``
- Scaffold authentication boilerplate = ``yes``
- Additional oAuth strategies (none, just hit enter)
- Use Socket.io = ``yes``

#### Using generators to add routes to your project
Do not add routes (i.e. html and Javascript files) by hand. Use the documentation for the angular-fullstack generator to see how you can add a route to your project. 


## Sample data
You are provided with sample data that can be used to initialize your test database. Place this file into the/server/config/environment directory, and it will be used to seed your local test database.

## User Stories
You should be keeping track of these somehow.

- As an administrator I would like to display a list of all students, ordered alphabetically by last name, first name.

- As an administrator I would like to display a list of all students, ordered by date of birth.

- As an administrator, I would like to display a list of all students, ordered by the number of credits that they have successfully completed (i.e. excluding the in-progress credits and grade F courses). 

- As an administrator I would like to view a list of students based on their major(s).

- As an administrator I would like to view detailed information for an individual student. 

- As an administrator, i would like to view all courses that a student has taken or is taking, with grades, including failed courses.

- As an administrator, I would like to display a list of students with their GPA. 

- As an administrator, I would like to display students' status based on their completed courses (freshman, sophomore, junior, senior) and sort/search by these parameters. 

- As an administrator, I would like to search student records based on courses that they are taking or have taken. 

## Switching to production mode with a remote database
The files that need to be modified: 

- server-side app.js: change the line 
```javascript
serveClient: (config.env === 'production') ? false : true,
```
to
```javascript
serveClient: true,
```
- add the following new task to Gruntfile.js, after the other registered tasks:
```javascipt
  grunt.registerTask('serveProd', function (target) {
    grunt.task.run([
      'clean:server',
      'env:prod',
      'concurrent:server',
      'injector',
      'wiredep',
      'autoprefixer',
      'express:dev',
      'wait',
      'open',
      'watch'
    ]);
  });
```
This will adda  new task `serveProd` to your grunt tasks, so you will be able to run it from the grunt menu, just like `serve`. 
- change express.js as follows:
in the `if` statement
```javascript 
if ('production' === env)
```
replace the lines
```javascript 
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));
```
with
```javascript 
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
```
- change the file production.js in `/server/config/environment` to look as follows (but note that the password will be different from `passwordToBeProvided`, it will be provided to you at the beginning of the lab)
```javascript 
'use strict';

// Production specific configuration
// =================================
module.exports = {
  //// Server IP
  //ip:       process.env.OPENSHIFT_NODEJS_IP ||
  //          process.env.IP ||
  //          undefined,
  //
  //// Server port
  //port:     process.env.OPENSHIFT_NODEJS_PORT ||
  //          process.env.PORT ||
  //          8080,

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://3601Lab:passwordToBeProvided@acrylic/softwareDev/?authSource=admin'
  }
};
```
**Make sure that your production.js is in .gitignore before entering the actual password.**

Once you have made all the changes, you should be able to run the production version by double-clicking on `serveProd` in the list of grunt tasks. **Important:** make sure to stop the `serve` task before starting the `serveProd` task. Note that you can alternate between the development task (with the test database) and the production task (with the remote database). The advantage of the test database is that you can change data in it to test for specific cases.   
