from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import List, Optional

from database import get_db
import models
import schemas
from auth import get_current_user
from utils import auto_categorize
from alerts import create_alert

router = APIRouter()

# -----------------
# Endpoints
# -----------------
@router.post("/add-reward", response_model=schemas.RewardResponse)
def add_reward(reward: schemas.RewardCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Stores extracted OCR reward data securely to the database.
    Automatically categorizes by platform and sets status to active.
    """
    if current_user.is_approved != 1:
        raise HTTPException(status_code=403, detail="Your account must be approved to add rewards.")

    category = auto_categorize(reward.platform)
    
    db_reward = models.Reward(
        platform=reward.platform,
        amount=reward.amount,
        expiry=reward.expiry,
        source=reward.source,
        category=category,
        status="active",
        user_id=current_user.id,
        created_at=datetime.utcnow()
    )
    
    db.add(db_reward)
    db.commit()
    db.refresh(db_reward)
    
    # Trigger alert
    create_alert(db, current_user.id, f"Successfully added {db_reward.platform} reward for ₹{db_reward.amount}")
    
    return db_reward

@router.put("/reward/{reward_id}/mark-used")
def mark_used(reward_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Mark a specific reward as 'used' and notify user."""
    reward = db.query(models.Reward).filter(
        models.Reward.id == reward_id, 
        models.Reward.user_id == current_user.id
    ).first()
    
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
        
    reward.status = "used"
    db.commit()
    
    create_alert(db, current_user.id, f"Reward from {reward.platform} marked as used.")
    
    return {"message": "Reward status updated to used successfully"}

@router.get("/mywallet")
def get_mywallet(status: Optional[str] = "all", db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Returns filtered rewards for the authenticated user's wallet.
    Filter: all, active, used, expired.
    """
    if current_user.is_approved != 1:
        raise HTTPException(status_code=403, detail="Your account must be approved to view your wallet.")

    query = db.query(models.Reward).filter(models.Reward.user_id == current_user.id)
    
    if status != "all":
        query = query.filter(models.Reward.status == status)
        
    rewards = query.all()
    
    return {
        "wallet": [
            {
                "platform": r.platform,
                "amount": r.amount,
                "expiry": r.expiry.strftime("%Y-%m-%d") if r.expiry else "No Expiry",
                "status": r.status,
                "category": r.category
            } for r in rewards
        ]
    }

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Returns comprehensive analytics for the dashboard.
    """
    if current_user.is_approved != 1:
        raise HTTPException(status_code=403, detail="Your account must be approved to view the dashboard.")

    user_rewards = db.query(models.Reward).filter(models.Reward.user_id == current_user.id).all()
    
    total_value = sum(r.amount for r in user_rewards if r.status == 'active')
    active_count = len([r for r in user_rewards if r.status == 'active'])
    used_count = len([r for r in user_rewards if r.status == 'used'])
    expired_count = len([r for r in user_rewards if r.status == 'expired'])
    
    categories = {}
    for r in user_rewards:
        categories[r.category] = categories.get(r.category, 0) + r.amount
        
    return {
        "total_rewards": total_value,
        "active_rewards": active_count,
        "used_rewards": used_count,
        "expired_rewards": expired_count,
        "categories": categories,
        "rewards_list": [
            {
                "id": r.id,
                "platform": r.platform,
                "amount": r.amount,
                "expiry": r.expiry.strftime("%Y-%m-%d") if r.expiry else None,
                "category": r.category,
                "status": r.status
            } for r in user_rewards
        ]
    }

@router.delete("/reward/{reward_id}")
def delete_reward(reward_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Delete a reward and notify user."""
    reward = db.query(models.Reward).filter(models.Reward.id == reward_id, models.Reward.user_id == current_user.id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
        
    db.delete(reward)
    db.commit()
    
    create_alert(db, current_user.id, f"Deleted {reward.platform} reward record.")
    
    return {"message": "Reward deleted successfully"}
