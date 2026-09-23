from typing import Annotated, Literal

from fastapi import Depends, FastAPI, Response, status
from pydantic import BaseModel

from app.database import is_database_available
from app.auth import router as auth_router
from app.dashboard import router as dashboard_router

app = FastAPI(title="alerts.surf")
app.include_router(auth_router)
app.include_router(dashboard_router)


class ApplicationStatus(BaseModel):
    status: Literal["ok", "unavailable"]
    database: Literal["ok", "unavailable"]


@app.get(
    "/api/status",
    response_model=ApplicationStatus,
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"model": ApplicationStatus}},
)
def get_application_status(
    response: Response,
    database_available: Annotated[bool, Depends(is_database_available)],
) -> ApplicationStatus:
    if database_available:
        return ApplicationStatus(status="ok", database="ok")

    response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return ApplicationStatus(status="unavailable", database="unavailable")
