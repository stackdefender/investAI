from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import UserProfile, User
from app.schemas.schemas import UserProfileUpdate, UserProfileResponse

router = APIRouter(prefix="/profile", tags=["User Profile"])

@router.get("/{user_id}", response_model=UserProfileResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        # Create default profile if missing
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/{user_id}", response_model=UserProfileResponse)
def update_user_profile(user_id: int, profile_in: UserProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)
    
    update_data = profile_in.dict(exclude_unset=True)
    for key, val in update_data.items():
        setattr(profile, key, val)
        
    db.commit()
    db.refresh(profile)
    return profile
