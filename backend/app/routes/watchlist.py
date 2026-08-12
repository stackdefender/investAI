from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import WatchlistItem
from app.schemas.schemas import WatchlistCreate, WatchlistResponse

router = APIRouter(prefix="/watchlist", tags=["User Watchlist"])

@router.get("/{user_id}", response_model=List[WatchlistResponse])
def get_user_watchlist(user_id: int, db: Session = Depends(get_db)):
    return db.query(WatchlistItem).filter(WatchlistItem.user_id == user_id).all()

@router.post("/{user_id}", response_model=WatchlistResponse)
def add_to_watchlist(user_id: int, item_in: WatchlistCreate, db: Session = Depends(get_db)):
    existing = db.query(WatchlistItem).filter(
        WatchlistItem.user_id == user_id,
        WatchlistItem.symbol == item_in.symbol
    ).first()
    if existing:
        return existing
        
    item = WatchlistItem(
        user_id=user_id,
        **item_in.dict()
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def remove_from_watchlist(item_id: int, db: Session = Depends(get_db)):
    item = db.query(WatchlistItem).filter(WatchlistItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Watchlist item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed from watchlist"}
