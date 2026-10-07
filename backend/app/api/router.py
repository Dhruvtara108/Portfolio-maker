from fastapi import APIRouter

from app.api.routes import health, portfolio

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(portfolio.router)
