from typing import Optional
from fastapi import APIRouter, HTTPException
from app.services.news_service import (
    get_news_list,
    get_news_by_id,
    fetch_and_extract_news_from_url,
    add_custom_news_item,
    fetch_live_rss_news
)
from app.services.ai_service import analyze_news_impact_with_ai
from app.schemas.schemas import NewsImpactRequest, NewsUrlFetchRequest, NewsCustomCreateRequest

router = APIRouter(prefix="/news", tags=["Financial News"])

@router.get("")
def list_news(category: Optional[str] = None, region: Optional[str] = None):
    return get_news_list(category, region)

@router.get("/live-rss")
def get_live_rss_news():
    return fetch_live_rss_news()

@router.get("/{news_id}")
def get_news_item(news_id: int):
    news = get_news_by_id(news_id)
    if not news:
        raise HTTPException(status_code=404, detail="News article not found")
    return news

@router.post("/analyze-custom")
def analyze_custom_news(req: NewsImpactRequest):
    return analyze_news_impact_with_ai(req.headline, req.summary, req.category or "Markets")

@router.post("/fetch-url")
def fetch_and_analyze_url(req: NewsUrlFetchRequest):
    if not req.url or not req.url.startswith("http"):
        raise HTTPException(status_code=400, detail="Please enter a valid website URL starting with http:// or https://")
    return fetch_and_extract_news_from_url(req.url, req.category or "Markets", req.region or "Global Economy")

@router.post("/custom")
def create_custom_news(req: NewsCustomCreateRequest):
    if not req.headline or not req.summary:
        raise HTTPException(status_code=400, detail="Headline and summary are required.")
    return add_custom_news_item(
        headline=req.headline,
        summary=req.summary,
        source=req.source or "Web Import",
        category=req.category or "Markets",
        region=req.region or "Global Economy",
        related_markets=req.related_markets or "Equities, Currencies, Commodities",
        full_content=req.full_content
    )
