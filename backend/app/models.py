import uuid
from datetime import date, time, datetime

from sqlalchemy import String, Text, Integer, Date, Time, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    patient_name: Mapped[str] = mapped_column(String(255))
    doctor_name: Mapped[str] = mapped_column(String(255))
    appointment_date: Mapped[date] = mapped_column(Date)
    appointment_time: Mapped[time] = mapped_column(Time)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=60)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    short_code: Mapped[str] = mapped_column(String(10), unique=True, index=True)
    page_views: Mapped[int] = mapped_column(Integer, default=0)
    calendar_clicks_google: Mapped[int] = mapped_column(Integer, default=0)
    calendar_clicks_ics: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
