from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date, datetime

# --- Auth Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr
    phone_number: Optional[str] = None


class UserCreate(UserBase):
    full_name: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    phone_number: Optional[str] = None

class UserResponse(UserBase):
    id: int
    full_name: Optional[str]
    bio: Optional[str]
    is_approved: int
    is_admin: int
    created_at: datetime

    class Config:
        from_attributes = True

class AdminApproval(BaseModel):
    user_id: int
    approve: bool # True to approve, False to reject

class Token(BaseModel):
    access_token: str
    token_type: str

class GoogleToken(BaseModel):
    credential: str

# --- Reward Schemas ---
class RewardCreate(BaseModel):
    platform: str
    amount: float
    expiry: date
    source: str = "ocr"

class RewardResponse(RewardCreate):
    id: int
    category: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Marketplace Schemas ---
class TradeCreate(BaseModel):
    offered_coupon_id: int
    requested_platform: str
    requested_value: str

class TradeResponse(BaseModel):
    id: int
    creator_user_id: int
    offered_coupon_id: int
    requested_platform: str
    requested_value: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class TradeTransactionResponse(BaseModel):
    id: int
    trade_id: int
    initiator_user_id: int
    acceptor_user_id: int
    offered_coupon_id: int
    received_coupon_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# --- Alert Schemas ---
class AlertResponse(BaseModel):
    id: int
    title: Optional[str] = None
    message: str
    created_at: datetime
    read_status: int
