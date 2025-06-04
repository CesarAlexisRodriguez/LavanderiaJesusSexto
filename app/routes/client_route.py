from flask import Blueprint, request, jsonify
from app.controllers.client_controller import create_client, serch_client_by_name, serch_client_by_phone, update_client, delete_client

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

@client_bp.route('/search/name', methods=['GET'])
def search_by_name():
    name = request.args.get('name')
    clients = serch_client_by_name(name)
    #FEA PERO ENTENDIBLE
    """data=[]
    for client in clients:
        data.append(client.to_dict())"""

    data=[client.to_dict() for client in clients]
    return jsonify(data), 200


@client_bp.route('/search/phone', methods=['GET'])
def search_by_phone():
    phone = request.args.get('phone')
    client = serch_client_by_phone(phone)
    if not client:
        return jsonify({'message': 'Cliente no encontrado'}), 404
    return jsonify(client.to_dict()), 200

@client_bp.route('/update/<int:client_id>', methods=['PUT'])
def update(client_id):
    data = request.get_json()
    client = update_client(client_id, data)
    if not client:
        return jsonify({'message': 'Cliente no encontrado'}), 400
    return jsonify({'message': 'Cliente actualizado exitosamente'}), 200


#eliminar
@client_bp.route('/delete/<int:client_id>', methods=['DELETE'])
def delete(client_id):
    client = delete_client(client_id)
    if not client:
        return jsonify({'message': 'Cliente no encontrado'}), 400
    return jsonify({'message': 'Cliente eliminado exitosamente'}), 200
