from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas

# Constants for IDEATHON PROTOTYPE
SECRET_KEY = "rewardsync-super-secret-jwt-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter()

# Mock/Placeholder for Google
GOOGLE_CLIENT_ID = "1062923577716-e5o1165o5q44e8v78u0j4i051r26fsg2.apps.googleusercontent.com" # Placeholder

# -----------------
# Helper Functions
# -----------------
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# -----------------
# Endpoints
# -----------------
@router.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(
        (models.User.username == user.username) | (models.User.email == user.email)
    ).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    hashed_password = get_password_hash(user.password)
    
    # Check if this is the first user; if so, make them admin and approved
    user_count = db.query(models.User).count()
    is_admin = 1 if user_count == 0 else 0
    is_approved = 1 if user_count == 0 else 0
    
    new_user = models.User(
        username=user.username, 
        email=user.email,
        full_name=user.full_name,
        phone_number=user.phone_number,
        password_hash=hashed_password,
        is_approved=is_approved,
        is_admin=is_admin,
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    if is_approved == 0:
        raise HTTPException(
            status_code=status.HTTP_202_ACCEPTED,
            detail="Account created! Your request is pending admin approval."
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if db_user.is_approved == 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is still pending admin approval."
        )
    elif db_user.is_approved == -1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account request has been rejected."
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username, "admin": db_user.is_admin}, expires_delta=access_token_expires
    )
    
    # 🔔 Trigger Expiry Check Simulation
    from utils import check_reward_expiry
    check_reward_expiry(db, db_user.id)
    
    return {"access_token": access_token, "token_type": "bearer"}

# --- Profile Endpoints ---
@router.get("/user/profile", response_model=schemas.UserResponse)
def get_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/user/profile", response_model=schemas.UserResponse)
def update_profile(profile_update: schemas.UserUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if profile_update.full_name is not None:
        current_user.full_name = profile_update.full_name
    if profile_update.bio is not None:
        current_user.bio = profile_update.bio
    if profile_update.phone_number is not None:
        current_user.phone_number = profile_update.phone_number
        
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/auth/google", response_model=schemas.Token)
def google_auth(token_data: schemas.GoogleToken, db: Session = Depends(get_db)):
    """
    Handle Google Sign-In. Decodes the Google Identity JWT.
    In production, this would use google-auth to verify the signature.
    """
    try:
        # For prototype: decode without full signature verification to avoid environment issues
        # In a real app, use: id_token.verify_oauth2_token(token_data.credential, requests.Request(), GOOGLE_CLIENT_ID)
        payload = jwt.get_unverified_claims(token_data.credential)
        
        email = payload.get('email')
        name = payload.get('name', email.split('@')[0])
        
        if not email:
            raise HTTPException(status_code=400, detail="Invalid Google payload")

        # Find or Create User
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            # Generate a unique username
            base_username = email.split('@')[0]
            username = base_username
            counter = 1
            while db.query(models.User).filter(models.User.username == username).first():
                username = f"{base_username}_{counter}"
                counter += 1
            
            # First user is admin/approved
            user_count = db.query(models.User).count()
            is_admin = 1 if user_count == 0 else 0
            is_approved = 1 # Auto-approve Google users for the demo!

            user = models.User(
                username=username,
                email=email,
                full_name=name,
                is_admin=is_admin,
                is_approved=is_approved,
                created_at=datetime.utcnow()
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "admin": user.is_admin}, 
            expires_delta=access_token_expires
        )
        
        # 🔔 Trigger Expiry Check Simulation
        from utils import check_reward_expiry
        check_reward_expiry(db, user.id)
        
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Google Auth Error: {str(e)}")
        raise HTTPException(status_code=400, detail="Google authentication failed")

# --- Admin Endpoints ---
@router.get("/admin/pending-users", response_model=List[schemas.UserResponse])
def get_pending_users(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return db.query(models.User).filter(models.User.is_approved == 0).all()

@router.post("/admin/approve")
def approve_user(approval: schemas.AdminApproval, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    target_user = db.query(models.User).filter(models.User.id == approval.user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    target_user.is_approved = 1 if approval.approve else -1
    db.commit()
    
    action = "approved" if approval.approve else "rejected"
    return {"message": f"User {target_user.username} has been {action}."}
