from flask import Blueprint, request, jsonify
from app.controllers.client_controller import create_client

client_bp = Blueprint('client_bp', __name__, url_prefix='/clients')

@client_bp.route('/create', methods=['POST'])
def create():
    data = request.get_json()
    name = data.get('name')
    phone_number = data.get('phone_number')
    address = data.get('address')

    if not name or not phone_number or not address:
        return jsonify({'message': 'Faltan datos requeridos'}), 400

    client = create_client(name, phone_number, address)
    return jsonify({
        'message': 'Cliente creado exitosamente',
        'client':client.to_dict()         
    }),200