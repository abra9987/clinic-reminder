from datetime import date, time, datetime
from uuid import UUID

from pydantic import BaseModel


class DoctorCreate(BaseModel):
    name: str


class DoctorOut(BaseModel):
    id: UUID
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AppointmentCreate(BaseModel):
    patient_name: str
    doctor_name: str
    appointment_date: date
    appointment_time: time
    duration_minutes: int = 60
    notes: str | None = None


class AppointmentOut(BaseModel):
    id: UUID
    patient_name: str
    doctor_name: str
    appointment_date: date
    appointment_time: time
    duration_minutes: int
    notes: str | None
    short_code: str
    page_views: int
    calendar_clicks_google: int
    calendar_clicks_ics: int
    created_at: datetime

    model_config = {"from_attributes": True}


class AppointmentListOut(BaseModel):
    items: list[AppointmentOut]
    total: int
