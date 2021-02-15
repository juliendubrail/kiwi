import datetime
import redis
import uuid
import json

from flask import Flask, jsonify, request, session
from http import HTTPStatus
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base
from flask_marshmallow import Marshmallow
from flask_cors import CORS
# from geoalchemy2 import Geometry
from flask_migrate import Migrate


# App Instantiation

app = Flask(__name__)

# REDIS DB CONNECTION

try:
    r = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
    r.ping()
except redis.ConnectionError:
    exit('Failed to connect to Redis, terminating.')

# Settings

CORS(app)

# POSTGRES CONNECTION

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql+psycopg2://kiwi@localhost:5432/kiwi"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# SQLAlchemy db instance

db = SQLAlchemy(app)
# Initialize Marshmallow
ma = Marshmallow(app)
engine = db.engine
connection = engine.connect()
migrate = Migrate(app, db)


# UTILS

def timestamp_to_datetime(response):
    "Converts redis unix timestamp to datetime object"
    if not response:
        return None
    try:
        response = float(response)
    except ValueError:
        return None
    return datetime.datetime.fromtimestamp(response).strftime('%c')

# Models map

Base = automap_base()
Base.prepare(db.engine, reflect=True)
Doors = Base.classes.doors
Users = Base.classes.users
Addresses = Base.classes.addresses
Permissions = Base.classes.user_door_permissions


# ROUTES
# GET DOORS - PAGINATED TO 10 DOORS ROWS PER PAGE
@app.route('/doors/<int:page>', methods=['GET'])
def get_doors(page=1):
    locations = db.session.query(Addresses, Doors).join(Doors).paginate(page, per_page=10).items
    results = []
    for address, door in locations:
        last_com = r.get(f'last_communication_ts:{door.sensor_uuid}')
        last_com = timestamp_to_datetime(last_com)

        if last_com is None:
            results.append(
                {
                    "id": door.id,
                    "name": door.name,
                    "address": address.street,
                    "sensor_id": door.sensor_uuid,
                    "last_communication": "none",
                }
            )
        else:
            results.append(
                {
                    "id": door.id,
                    "name": door.name,
                    "address": address.street,
                    "sensor_id": door.sensor_uuid,
                    "last_communication": last_com,
                }
            )

    response = jsonify(results)
    response.status_code = 200
    return response


# GET SINGLE DOOR
@app.route('/door/<int:door_id>', methods=['GET'])
def get_door(door_id):

    door = db.session.query(Doors).get(door_id)
    address = db.session.query(Addresses).filter_by(id=door.address_id).first()

    redis_last_com = r.get(f'last_communication_ts:{door.sensor_uuid}')
    last_com = timestamp_to_datetime(redis_last_com)
    redis_last_open = r.get(f'last_opening_ts:{door.sensor_uuid}')
    last_open = timestamp_to_datetime(redis_last_open)

    permissions = db.session.query(Permissions).filter_by(door_id=door_id).all()

    users_allowed_id = []
    for perm in permissions:
        users_allowed_id.append(perm.user_id)

    jedis = db.session.query(Users).filter(Users.id.in_(users_allowed_id)).all()
    users_not_allowed = db.session.query(Users).filter(Users.id.notin_(users_allowed_id)).all()

    other_users = []
    for user in users_not_allowed:
        other_users.append(({"id":user.id, "firstname": user.first_name, "lastname":user.last_name, "email": user.email}))

    siths = []
    for jedi in jedis:
        siths.append({"id":jedi.id, "firstname":jedi.first_name, "lastname":jedi.last_name, "email":jedi.email})

    results = []
    results.append(
        {
        "name": door.name,
        "sensor_uuid": door.sensor_uuid,
        "id": door.id,
        "street": address.street,
        "postal_code": address.postal_code,
        "city": address.city,
        "country": address.country_code,
        "installation_time": door.installation_time,
        "last_communication": last_com,
        "last_opening": last_open,
        "users": siths,
        "other_users": other_users

    }
    )

    response = jsonify(results)
    response.status_code = 200
    return response


# UPDATE SINGLE DOOR PERMISSIONS
@app.route('/door/<int:door_id>/<int:user_id>', methods=["POST"])
def add_access(door_id, user_id):
    #user = db.session.query(Permissions).filter(Permissions.door_id == door_id, Permissions.user_id == user_id).delete()
    user = Permissions(door_id = door_id, user_id = user_id)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        'message': 'Permission Added',
    })


# LAUNCH SERVER
if __name__ == "__main__":
    app.run(debug=False)
