import logging

from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

from app.config import DATABASE_URL

logger = logging.getLogger(__name__)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_timeout=2,
    connect_args={"connect_timeout": 2},
)


def is_database_available() -> bool:
    try:
        with engine.connect() as connection:
            return connection.execute(text("SELECT 1")).scalar_one() == 1
    except SQLAlchemyError as error:
        logger.warning(
            "PostgreSQL connectivity check failed (%s)",
            type(error).__name__,
        )
        return False
