from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from app.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

class Beach(BaseModel):
    id: int
    name: str
    region: str
    condition_score: int
    swell: str
    wind: str

class Tide(BaseModel):
    current_level: str
    trend: str
    next_high: str
    next_low: str

class Board(BaseModel):
    id: int
    model: str
    length: str
    volume: float
    fin_setup: str
    wave_suitability: str

class Alert(BaseModel):
    id: int
    rule: str
    status: str

class DashboardSummary(BaseModel):
    beaches: List[Beach]
    tides: Tide
    quiver: List[Board]
    alerts: List[Alert]

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(user: str = Depends(get_current_user)):
    return DashboardSummary(
        beaches=[
            Beach(id=1, name="Playa Norte", region="Gijon", condition_score=8, swell="1.5m 12s NW", wind="10kt S"),
            Beach(id=2, name="Salinas", region="Castrillon", condition_score=6, swell="2.0m 10s NW", wind="15kt SW")
        ],
        tides=Tide(current_level="1.2m", trend="rising", next_high="14:30", next_low="20:45"),
        quiver=[
            Board(id=1, model="Hypto Krypto", length="5'8\"", volume=31.0, fin_setup="Thruster", wave_suitability="0.5m-2m"),
            Board(id=2, model="Midlength", length="7'0\"", volume=45.0, fin_setup="Single", wave_suitability="0.5m-1.5m")
        ],
        alerts=[
            Alert(id=1, rule="Swell > 1.5m and Wind Off-shore", status="active")
        ]
    )
