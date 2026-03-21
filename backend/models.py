from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    """User Model for Authentication and Profile"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    full_name = Column(String, nullable=True)
    phone_number = Column(String, unique=True, index=True, nullable=True)
    bio = Column(String, nullable=True)
    is_approved = Column(Integer, default=0) # 0: Pending, 1: Approved, -1: Rejected
    is_admin = Column(Integer, default=0) # 0: User, 1: Admin
    created_at = Column(DateTime, default=datetime.utcnow)

    
    # Relationships
    rewards = relationship("Reward", back_populates="owner")
    trades = relationship("Trade", back_populates="creator")
    alerts = relationship("Alert", back_populates="user")

class Reward(Base):
    """Reward Model for storing OCR extracts and user rewards"""
    __tablename__ = "rewards"
    
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, index=True)
    amount = Column(Float)
    expiry = Column(Date)
    source = Column(String) # ocr, sms, manual
    category = Column(String)
    status = Column(String, default="active") # active, used, expired
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Foreign key link back to users table
    user_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="rewards")
    trade = relationship("Trade", back_populates="reward", uselist=False)

class Trade(Base):
    """Trade Model for marketplace listings"""
    __tablename__ = "trades"
    
    id = Column(Integer, primary_key=True, index=True)
    creator_user_id = Column(Integer, ForeignKey("users.id"))
    offered_coupon_id = Column(Integer, ForeignKey("rewards.id"))
    requested_platform = Column(String) # Specific platform preferred
    requested_value = Column(String)    # Equal, Higher, or Any
    status = Column(String, default="open") # open, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    
    creator = relationship("User", back_populates="trades")
    reward = relationship("Reward", back_populates="trade")

class TradeTransaction(Base):
    """TradeTransaction Model for record keeping"""
    __tablename__ = "trade_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    trade_id = Column(Integer, ForeignKey("trades.id"))
    initiator_user_id = Column(Integer, ForeignKey("users.id"))
    acceptor_user_id = Column(Integer, ForeignKey("users.id"))
    offered_coupon_id = Column(Integer, ForeignKey("rewards.id"))
    received_coupon_id = Column(Integer, ForeignKey("rewards.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)

class Alert(Base):
    """Alert Model for user notifications"""
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=True)
    message = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    read_status = Column(Integer, default=0) # 0 for unread, 1 for read
    
    user = relationship("User", back_populates="alerts")
