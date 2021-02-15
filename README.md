# Python (Flask) - React Fullstack App
To work on top of the Postgresql and Redis Databases
running in the given Docker Container.

## Commands
 
Run

    docker-compose build
    docker-compose up

Launch a local server for Flask (on port 5000)
and React (on port 3000). Head over to

    http://localhost:3000/ 

Data retrieved from API calls
to our Flask server, which can be accessed at these endpoints

    http://localhost:5000/doors/1

    (list of 10 first doors)

    http://localhost:5000/door/id

    (detailled info of specific door id)

    Additional User can be given access to a specific door
    with a POST request at

    http://localhost:5000/door_id/user_id