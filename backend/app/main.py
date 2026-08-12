from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.seed_data import seed_database
from app.routes import (
    auth, profile, market, stocks, mutual_funds,
    news, ai, portfolio, goals, calculators, watchlist, education
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Auto seed demo data if DB is empty
try:
    with SessionLocal() as db_session:
        seed_database(db_session)
except Exception as e:
    print(f"Seed database warning: {e}")

app = FastAPI(
    title=settings.APP_NAME,
    description="Full-Stack AI Investment & Personal Finance Platform Backend",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev/production local setup
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(auth.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(market.router, prefix="/api")
app.include_router(stocks.router, prefix="/api")
app.include_router(mutual_funds.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(portfolio.router, prefix="/api")
app.include_router(goals.router, prefix="/api")
app.include_router(calculators.router, prefix="/api")
app.include_router(watchlist.router, prefix="/api")
app.include_router(education.router, prefix="/api")

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "message": "InvestAI Financial Backend Engine Running Successfully"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
