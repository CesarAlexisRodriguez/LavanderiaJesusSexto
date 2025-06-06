from app.models.user import User
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import timedelta, datetime
from app.models.log import Log

def login_user(email, password):
    #busqueda del usuario
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        log = Log(user_id=user.id, action='login', date=datetime.now())
        db.session.add(log)
        db.session.commit()
        return access_token
    return None

def logout_user(user_id):
    log = Log(user_id=user_id, action='logout', date=datetime.now())
    db.session.add(log)
    db.session.commit()
    return True

def update_user(user_id, updated_data):
    user = User.query.get(user_id)
    if not user:
        return None
    
    for key, value in updated_data.items():
        if key == 'password':
            setattr(user, key, generate_password_hash(value))
        else:
            setattr(user, key, value)
    db.session.commit()
    return user

def toggle_user_status(user_id, is_active:str):
    user = User.query.get(user_id)
    if not user:
        return None
    user.state = is_active
    db.session.commit()
    return user

def get_user_logs(user_id):
    logs = Log.query.filter_by(user_id=user_id).order_by(Log.date.desc()).all()
    return logs

