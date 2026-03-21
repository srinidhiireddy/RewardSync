from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter()

def create_alert(db: Session, user_id: int, message: str, title: str = "System Alert"):
    """System utility to generate a notification for a user."""
    new_alert = models.Alert(
        user_id=user_id,
        title=title,
        message=message,
        created_at=datetime.utcnow(),
        read_status=0
    )
    db.add(new_alert)
    db.commit()

@router.get("/alerts", response_model=list[schemas.AlertResponse])
def get_alerts(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Fetch latest 20 notifications for the authenticated user."""
    alerts = db.query(models.Alert).filter(
        models.Alert.user_id == current_user.id
    ).order_by(models.Alert.created_at.desc()).limit(20).all()
    
    return alerts
