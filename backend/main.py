from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from database import engine, Base
import auth
import rewards
import marketplace
import alerts
from scheduler import start_scheduler

# Automatically bootstrap SQLite tables on startup
Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RewardSync")

app = FastAPI(
    title="RewardSync API", 
    version="1.1.0", 
    description="Advanced modular backend prototype with full Reward, Marketplace, and Alert systems."
)

# Enable CORS for frontend interactions
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hook up modular routers
app.include_router(auth.router, tags=["User Authentication"])
app.include_router(rewards.router, tags=["Rewards API"])
app.include_router(marketplace.router, tags=["Marketplace Trading"])
app.include_router(alerts.router, tags=["Notification System"])

@app.on_event("startup")
def on_startup():
    logger.info("Initializing RewardSync Backend...")
    # Start APScheduler for daily expiry checks
    start_scheduler()

@app.get("/")
def read_root():
    """Health check and simple greeting endpoint"""
    return {
        "status": "online",
        "message": "RewardSync Backend v1.1.0 is successfully running.",
        "docs": "/docs",
        "auth_signup": "/signup",
        "wallet": "/mywallet",
        "marketplace": "/marketplace"
    }
