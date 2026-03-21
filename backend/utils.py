import logging

def auto_categorize(platform: str) -> str:
    """
    Automatically assigns a category to a reward based on the platform name.
    """
    p = platform.lower()
    
    # Precise Platform Mapping for better analytics
    food = ["swiggy", "zomato", "ubereats", "food", "restaurant"]
    shopping = ["amazon", "flipkart", "myntra", "shopping", "ecommerce", "ajio"]
    travel = ["makemytrip", "goibibo", "air india", "indigo", "travel", "hotel"]
    payments = ["phonepe", "paytm", "googlepay", "gpay", "cred", "recharge"]
    
    if any(keyword in p for keyword in food):
        return "food"
    elif any(keyword in p for keyword in shopping):
        return "shopping"
    elif any(keyword in p for keyword in travel):
        return "travel"
    elif any(keyword in p for keyword in payments):
        return "payments"
    
    return "other"

def get_logger():
    """Setup a simple logger for terminal alerts"""
    logger = logging.getLogger("RewardSync")
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        ch = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        ch.setFormatter(formatter)
        logger.addHandler(ch)
    return logger

logger = get_logger()

def check_reward_expiry(db, user_id: int):
    """
    Simulates a background job checking for coupons expiring in the next 24 hours.
    Creates an alert in the database for any soon-to-expire rewards.
    """
    from datetime import datetime, timedelta
    from models import Reward, Alert
    
    # In a real app, this would be a Cron job or Celery task
    now = datetime.now()
    tomorrow = now + timedelta(days=1)
    
    # Query for active rewards belonging to the user that expire soon
    expiry_rewards = db.query(Reward).filter(
        Reward.user_id == user_id,
        Reward.status == "active",
        Reward.expiry <= tomorrow.date(),
        Reward.expiry > now.date()
    ).all()
    
    for r in expiry_rewards:
        # Create a persistent alert
        msg = f"Your {r.platform} coupon is expiring tomorrow! Use it now."
        new_alert = Alert(
            user_id=user_id,
            title="Coupon Expiring Soon! ⏰",
            message=msg,
            created_at=datetime.utcnow(),
            read_status=0
        )
        db.add(new_alert)
        
        # Simulate an FCM Push Notification
        send_fcm_notification(user_id, "RewardSync Alert", msg)
        
    db.commit()

def send_fcm_notification(user_id: int, title: str, body: str):
    """
    Mock function to simulate sending a real FCM Push Notification.
    In production, this would use 'firebase-admin' to send to the user's FCM token.
    """
    logger.info(f"🚀 [FCM PUSH] To User {user_id}: {title} - {body}")
