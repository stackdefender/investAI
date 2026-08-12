from typing import Optional
from fastapi import APIRouter, HTTPException
from app.services.market_service import get_stock_list, get_stock_by_symbol, get_stock_chart_data
from app.services.ai_service import analyze_stock_with_ai

router = APIRouter(prefix="/stocks", tags=["Stocks Explorer"])

@router.get("")
def list_stocks(search: Optional[str] = None):
    return get_stock_list(search)

@router.get("/{symbol}")
def get_stock(symbol: str):
    stock = get_stock_by_symbol(symbol)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

@router.get("/{symbol}/chart")
def get_stock_chart(symbol: str, timeframe: str = "1Y"):
    return get_stock_chart_data(symbol, timeframe)

@router.post("/{symbol}/analyze")
def analyze_stock(symbol: str):
    stock = get_stock_by_symbol(symbol)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return analyze_stock_with_ai(stock)
