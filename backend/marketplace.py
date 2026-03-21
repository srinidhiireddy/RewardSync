from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from database import get_db
import models
import schemas
from auth import get_current_user
from alerts import create_alert

router = APIRouter()

# -----------------
# Endpoints
# -----------------
@router.post("/marketplace/create-trade")
def create_trade(trade: schemas.TradeCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    List a reward for trade on the marketplace.
    """
    if current_user.is_approved != 1:
        raise HTTPException(status_code=403, detail="Your account must be approved to list trades.")

    # Verify reward ownership and status
    reward = db.query(models.Reward).filter(
        models.Reward.id == trade.offered_coupon_id, 
        models.Reward.user_id == current_user.id,
        models.Reward.status == "active"
    ).first()
    
    if not reward:
        raise HTTPException(status_code=404, detail="Active reward not found or unauthorized.")
        
    # Check if a trade listing already exists for this reward
    existing_trade = db.query(models.Trade).filter(
        models.Trade.offered_coupon_id == reward.id, 
        models.Trade.status == "open"
    ).first()
    
    if existing_trade:
        raise HTTPException(status_code=400, detail="Reward is already listed in the marketplace.")

    # 🛡️ Safety: Check if not already in another trade
    if reward.status != "active":
         raise HTTPException(status_code=400, detail=f"Reward is currently {reward.status}")

    new_trade = models.Trade(
        creator_user_id=current_user.id,
        offered_coupon_id=reward.id,
        requested_platform=trade.requested_platform,
        requested_value=trade.requested_value,
        status="open",
        created_at=datetime.utcnow()
    )
    
    # 🔒 Lock coupon
    reward.status = "in_trade"
    
    db.add(new_trade)
    db.commit()
    db.refresh(new_trade)
    
    create_alert(db, current_user.id, f"Your trade request for {reward.platform} is now live in the marketplace.")
    
    return {"message": "Trade listing created successfully", "trade_id": new_trade.id}

@router.get("/marketplace", response_model=List[schemas.TradeResponse])
def get_marketplace(db: Session = Depends(get_db)):
    """
    Returns all open trades currently listed by any user.
    """
    return db.query(models.Trade).filter(models.Trade.status == "open").all()

@router.get("/marketplace/my-trades", response_model=List[schemas.TradeResponse])
def get_my_trades(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Returns all trades created by the current user.
    """
    return db.query(models.Trade).filter(models.Trade.creator_user_id == current_user.id).all()

@router.post("/marketplace/accept/{trade_id}")
def accept_trade(trade_id: int, acceptor_coupon_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Accept an open trade, swapping the ownership of both rewards.
    """
    if current_user.is_approved != 1:
        raise HTTPException(status_code=403, detail="Your account must be approved to accept trades.")

    trade = db.query(models.Trade).filter(
        models.Trade.id == trade_id, 
        models.Trade.status == "open"
    ).first()
    
    if not trade:
        raise HTTPException(status_code=404, detail="Open trade not found.")
        
    if trade.creator_user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot accept your own trade listing.")

    # Offered Coupon (By Creator)
    offered_reward = trade.reward
    
    # Acceptor's Coupon
    received_reward = db.query(models.Reward).filter(
        models.Reward.id == acceptor_coupon_id,
        models.Reward.user_id == current_user.id,
        models.Reward.status == "active"
    ).first()

    if not received_reward:
        raise HTTPException(status_code=404, detail="Your selected reward is not available for trade.")

    # Execute Ownership Swap
    creator_id = trade.creator_user_id
    acceptor_id = current_user.id

    # Creator's coupon goes to Acceptor
    offered_reward.user_id = acceptor_id
    offered_reward.status = "active"
    
    # Acceptor's coupon goes to Creator
    received_reward.user_id = creator_id
    received_reward.status = "active"

    trade.status = "completed"

    # Create Transaction Record
    txn = models.TradeTransaction(
        trade_id=trade.id,
        initiator_user_id=creator_id,
        acceptor_user_id=acceptor_id,
        offered_coupon_id=offered_reward.id,
        received_coupon_id=received_reward.id,
        timestamp=datetime.utcnow()
    )
    db.add(txn)
    db.commit()
    
    # Notify both users
    create_alert(db, acceptor_id, f"Trade accepted! Your coupon has been successfully traded for {offered_reward.platform}.")
    create_alert(db, creator_id, f"Your {offered_reward.platform} coupon has been successfully traded!")
    
    return {"message": "Trade completed successfully!"}

@router.post("/marketplace/cancel/{trade_id}")
def cancel_trade(trade_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    trade = db.query(models.Trade).filter(
        models.Trade.id == trade_id,
        models.Trade.creator_user_id == current_user.id,
        models.Trade.status == "open"
    ).first()
    
    if not trade:
        raise HTTPException(status_code=404, detail="Trade listing not found.")
    
    # Unlock reward
    trade.reward.status = "active"
    trade.status = "cancelled"
    db.commit()
    
    create_alert(db, current_user.id, "Trade request cancelled.")
    return {"message": "Trade cancelled successfully"}
