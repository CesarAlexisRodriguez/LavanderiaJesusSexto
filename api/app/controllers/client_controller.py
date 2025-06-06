from app.models.clientes import Cliente
from app import db

def create_client(name, phone_number, address):
    new_client = Cliente(name=name, phone_number=phone_number, address=address)
    db.session.add(new_client)
    db.session.commit()
    return new_client

def serch_client_by_name(name):
    return Cliente.query.filter(Cliente.name.ilike(f'%{name}%')) .all()

def serch_client_by_phone(phone):
    return Cliente.query.filter_by(phone_number=phone).first()


def update_client(client_id, updated_data):
    client = Cliente.query.get(client_id)
    if not client:
        return None
    for key, value in updated_data.items():
        setattr(client, key, value)
    db.session.commit()
    return client

def delete_client(client_id):
    client = Cliente.query.get(client_id)
    if not client:
        return None
    db.session.delete(client)
    db.session.commit()
    return client


