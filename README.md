# marlow
A collection of tools to help you build in the marko-js, marko widget, and lasso stack.

# installation
```sh
$ git clone git@github.com:bryceewatson/marlow`
$ cd marlow && npm link
```

# usage

To open the web ui
```sh
$ marlow
```

To generate a new project
```sh
$ marlow --generate my-project
```

To generate and start a new project
```sh
$ marlow --generate my-project --start
```

# getting started

1. Get marlow-tools:

  ```sh
  $ git clone git@github.com:bryceewatson/marlow`
  $ cd marlow && npm link
  ```

2. Create your project:

    ```sh
    $ marlow --generate space-station-tracker --start
    ```
You should see the default hello-marko project in your browser. Don't worry, we will be modifying this project into a space station tracker.

3. Let's build our first marko widget. In the space-station-tracker folder, navigate to the src/components folder and create a new component for our station-station-tracker app. The easiest way is to copy an existing widget:

  ```sh
  $ cd space-station-tracker/src/components
  $ cp app-hello-message app-location-display
  $ cd app-location-display
  ```
Click [here](http://markojs.com/docs/marko-widgets/) to learn more about marko widgets.

3. We will start by modifying the template.marko file. Replace the existing code in this file to:

  ```html
  <section id="app-location-display" w-bind>
      <div>${data.lat}, ${data.lng}</div>
  </section>
  ```

4. Now, modify the marko-tag.json file to define the data object's properties:

  ```json
  {
    "@lat": "string",
    "@lng": "sting"
  }
  ```

5. In index.js, we need to define the widget state variables. In the `getInitialState` function, change `name: input.name,` to `lat: input.lat`, and `welcomeMsg: input.welcomeMsg` to `lng: input.lng`.

6. Similarly, in `getTemplateData`, change `name: state.name` to `lat: state.lat` and `welcomeMsg: state.welcomeMsg` to `lng: state.lng`.

7. Congratulations, you've created your first marko widget! Now, let's add some data. For our project, we're going to be using the "Open Notify" API to get the current location of the [International Space Station](http://open-notify.org/Open-Notify-API/ISS-Location-Now/).

8. In the Copy the hello folder into a location folder:

  ```sh
  $ cd space-station-tracker/src/services
  $ cp hello location
  ```

9. In the location folder, modify the routes.js file's module.exports object to point to our new location endpoint. We will be defining the `getLocation` method shortly:

    ```js
    module.exports = {
        name: 'getLocation',
        method: 'GET',
        path '/api/getLocation'
    }
    ```

10. In handlers.js, replace all of the code with the following:

  ```js
  var http = require('http');

  module.exports = {
      getLocation: function (args, callback) {
          http.get('http://api.open-notify.org/iss-now.json', (res) => {
              var body = '';
              res.on('data', function(chunk){
                  body += chunk;
              });
              res.on('end', function(){
                  callback(null, {
                      location: JSON.parse(body)
                  });
              });
          }).on('error', (e)=> {
              console.log('Error getting location: ${e.message}');
          });
      }
  };
  ```
11. Now that we've defined the service, let's connect it to our application. In src/app/App.js, replace

  ```js
  var helloService = require('src/services/hello');
  ```
  with

  ```js
  var locationService = require('src/services/location');
  ```

12. Next, within the App.prototype object, replace the `getWelcomeMsg` function with the following code:

  ```js
  getLocation: function() {
      var self = this;
      this.serverSyncPromise = new Promise(function(resolve, reject){
          locationService.getLocation({}, function(err,data){
              if(err){
                  return reject(err);
              }
              var location = {
                  lat: parseFloat(data.location.iss_position.latitude).toPrecision(5),
                  lng: parseFloat(data.location.iss_position.longitude).toPrecision(5)
              };
              self.state.set('location', location); //emits an app state change event
              resolve();
          });
      });
      return this.initialServerSyncPromise;
  },
  ```
  Whenever App.getLocation is called, the locationService is called, and the response is used to update the state object.

13. In AppState.js, let's initialize the AppState method and set our default values. Remove

  ```js
  this.name = state.name || 'World';
  this.welcomeMsg = state.welcomeMsg || null;
  ```
  with

  ```js
  this.location = state.location || {lat: 0, lng: 0};
  ```
  When AppState's set method is called, a change event is triggered, which causes the widgets to be rerendered. We will see how the widgets are rerendered next.

14. In the root directory's index.js file, replace

  ```js
  require('./src/services/hello').addRoutes(app);
  ```
  with
  ```js
  require('./src/services/location').addRoutes(app);
  ```

15. Now that our service is in place, let's connect it to the marko widgets. The main app widget (located in components/app) subscribes to this change event and receives the location data. Replace the existing `getTemplateData` method to the following:

  ```js
  getTemplateData: function(state, input){
      var location = state.location;
      return {
          location: location
      };
  },
  ```
  This sends our location object to the widget template in components/app .

16. In components/app/template.marko, replace the existing <app-main/> element with:  

  ```html
  <app-main location=data.location />
  ```
  This passes the location to the app-main widget.

17. In app-main, replace the existing <app-live-textbook/> and <app-hello-message/> elements with:

  ```html
  <app-location-display lat=data.location.lat lng=data.loation.lng />
  ```
  This passes the latitude and longitude to our app-location-display widget.

18. Before we go to our app-location-display widget, we need to change the object in marko-tag.json to:

  ```json
  {
    "@location": "expression"
  }
  ```
18. You may be wondering why we pass the location data through multiple layers of widgets. In a larger application, a main app widget could be used to manage multiple UI components and associated data. In app-main's index.js file, modify the `getInitialState` method to return:

  ```js
  {
    location: input.location
  }
  ```  
19. Modify the `getTemplateData` method to return:

  ```js
  {
    location: state.location
  }
  ```  

20. Now, run the application by entering `npm start` in the terminal. In your browser and go to localhost:8080. You should see 0, 0 since these are our default coordinates. Next, we will call our service at regular intervals to display location data dynamically.

21. In app-location-display/index.js, let's override the init method.

  ```js
  init: function(){
      setInterval(function(){
          app.getLocation();
      }, 3000);
  }
  ```
Finally, we can update our app-location-display widget to render the latitude and longitude to the page:

21. [Optional] Let's put the finishing touches on our application. In components/app-header, change the text within the `<h1>` tags to "International Space Station Location Tracker".

22. [Optional] To make our font look "spacey,", go to src/pages/home/template.marko and add the font style:

  ```html
  <link href="https://fonts.googleapis.com/css?family=Orbitron" rel="stylesheet" type="text/css">
  ```
  In app-location-display, create a style.less file:

  ```css
  #app-location-display {
      font-family: 'Orbitron', sans-serif;
      background-color: black,
      color: lightgreen;
      display: inline-block;
  }
  ```
  In components/app-location-display, add a file called browser.js with the following code:

  ```json
  {
    "dependencies": [
      "style.less"
    ]
  }
  ```
23. [Optional] Since we do not need the app-hello-message and app-live-textbox components, we can delete these from the components folder.
