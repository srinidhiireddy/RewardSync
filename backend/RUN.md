# RewardSync Backend v1.1.0

## Features
- **User Authentication**: Signup/Login with JWT & bcrypt (supports email).
- **Reward Management**: OCR data storage with auto-category detection.
- **Wallet Filters**: `GET /mywallet?status=active|used|expired`.
- **Marketplace Trading**: Secure reward ownership swapping between users.
- **Live Alerts**: System-triggered notifications for all key events.
- **Daily Expiry Checks**: Automated status updates and alerts via APScheduler.

## How to Run

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

3. **Access API Documentation**:
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Example API Requests

### Signup
```bash
curl -X POST "http://localhost:8000/signup" \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
```

### Marketplace Listing
```bash
curl -X POST "http://localhost:8000/marketplace/create-trade" \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{"reward_id": 1, "desired_category": "shopping"}'
```

### Accept Trade
```bash
curl -X POST "http://localhost:8000/marketplace/accept/1" \
-H "Authorization: Bearer <token>"
```
