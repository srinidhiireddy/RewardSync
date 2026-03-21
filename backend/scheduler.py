from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date, timedelta, datetime
from sqlalchemy.orm import Session
import logging

from database import SessionLocal
import models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_expiries():
    """
    Daily background task to:
    1. Update rewards to 'expired' status if the date has passed.
    2. Generate alerts for rewards expiring in 7, 3, and 1 days.
    """
    db: Session = SessionLocal()
    today = date.today()
    
    try:
        from alerts import create_alert
        # 1. Update status to 'expired'
        expired_rewards = db.query(models.Reward).filter(
            models.Reward.expiry < today,
            models.Reward.status == "active"
        ).all()
        
        for r in expired_rewards:
            r.status = "expired"
            create_alert(db, r.user_id, f"Oops! Your reward from {r.platform} has expired.", title="Coupon Expired")
            logger.info(f"Marked reward {r.id} as expired.")
            
        # 2. Daily check for nearing expiries
        alert_days = [7, 3, 1]
        for days in alert_days:
            target_date = today + timedelta(days=days)
            nearing_rewards = db.query(models.Reward).filter(
                models.Reward.expiry == target_date,
                models.Reward.status == "active"
            ).all()
            
            for r in nearing_rewards:
                create_alert(db, r.user_id, f"Alert: Your {r.platform} reward expires in {days} day(s)!", title="Expiry Warning")
                logger.info(f"Sent {days}-day alert for reward {r.id}.")

        db.commit()
    except Exception as e:
        logger.error(f"Scheduler Job Error: {e}")
        db.rollback()
    finally:
        db.close()

def start_scheduler():
    scheduler = BackgroundScheduler()
    # Run once at startup for presentation demo, then every 24 hours
    scheduler.add_job(check_expiries, 'date', run_date=datetime.now())
    scheduler.add_job(check_expiries, 'interval', hours=24)
    
    scheduler.start()
    logger.info("APScheduler Daily Expiry Checks active.")
