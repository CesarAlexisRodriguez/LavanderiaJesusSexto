from app.database.db import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    estimated_delivery_date = db.Column(db.DateTime, nullable=True)
    real_delivery_date = db.Column(db.DateTime, nullable=True)
    state = db.Column(db.String(20), default='recibido')

    total = db.Column(db.Integer, nullable=False)
    pagado = db.Column(db.Boolean, default=False)

    # Relaciones inversas pendientes