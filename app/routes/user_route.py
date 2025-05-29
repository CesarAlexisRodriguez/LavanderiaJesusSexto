from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from app.models.user import User
from app.database.db import db

user_bp = Blueprint('user', __name__, url_prefix='/users')

@user_bp.route('/register', methods=['POST'])
def create_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    rol = data.get('rol')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'message': 'Faltan datos requeridos'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'El correo ya está en uso'}), 400
    
    password_hash = generate_password_hash(password)
    new_user = User(name=name, email=email, password=password_hash, rol=rol)
    db.session.add(new_user)

    #registra un cambio en la base de datos
    db.session.commit()
    return jsonify({'msg': 'Usuario creado exitosamente'}), 200