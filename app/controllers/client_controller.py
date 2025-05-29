from app.models.clientes import Cliente
from app import db

def create_client(name, phone_number, address):
    new_client = Cliente(name=name, phone_number=phone_number, address=address)
    db.session.add(new_client)
    db.session.commit()
    return new_client