import secrets
import string
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Header
from fastapi.responses import Response
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import ADMIN_PASSWORD, SUPER_ADMIN_PASSWORD
from app.database import get_db
from app.models import Appointment, Doctor
from app.schemas import AppointmentCreate, AppointmentOut, AppointmentListOut, DoctorCreate, DoctorOut
from app.ics_generator import generate_ics

router = APIRouter()

ALPHABET = string.ascii_letters + string.digits


def make_short_code(length: int = 8) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))


async def verify_admin(x_admin_password: str = Header()):
    if x_admin_password not in (ADMIN_PASSWORD, SUPER_ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Неверный пароль")


async def verify_super_admin(x_admin_password: str = Header()):
    if x_admin_password != SUPER_ADMIN_PASSWORD:
        raise HTTPException(status_code=403, detail="Нет доступа")


@router.post("/api/auth/login")
async def login(x_admin_password: str = Header()):
    if x_admin_password == SUPER_ADMIN_PASSWORD:
        return {"ok": True, "role": "super"}
    if x_admin_password == ADMIN_PASSWORD:
        return {"ok": True, "role": "admin"}
    raise HTTPException(status_code=401, detail="Неверный пароль")


# --- Doctors API ---

@router.get("/api/doctors", response_model=list[DoctorOut], dependencies=[Depends(verify_admin)])
async def list_doctors(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Doctor).order_by(Doctor.name))
    return result.scalars().all()


@router.post("/api/doctors", response_model=DoctorOut, dependencies=[Depends(verify_super_admin)])
async def create_doctor(data: DoctorCreate, db: AsyncSession = Depends(get_db)):
    doctor = Doctor(name=data.name)
    db.add(doctor)
    await db.commit()
    await db.refresh(doctor)
    return doctor


@router.delete("/api/doctors/{doctor_id}", dependencies=[Depends(verify_super_admin)])
async def delete_doctor(doctor_id: UUID, db: AsyncSession = Depends(get_db)):
    doctor = await db.get(Doctor, doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    await db.delete(doctor)
    await db.commit()
    return {"ok": True}


# --- Admin API ---

@router.post("/api/appointments", response_model=AppointmentOut, dependencies=[Depends(verify_admin)])
async def create_appointment(data: AppointmentCreate, db: AsyncSession = Depends(get_db)):
    short_code = make_short_code()
    appt = Appointment(
        patient_name=data.patient_name,
        doctor_name=data.doctor_name,
        appointment_date=data.appointment_date,
        appointment_time=data.appointment_time,
        duration_minutes=data.duration_minutes,
        notes=data.notes,
        short_code=short_code,
    )
    db.add(appt)
    await db.commit()
    await db.refresh(appt)
    return appt


@router.get("/api/appointments", response_model=AppointmentListOut, dependencies=[Depends(verify_admin)])
async def list_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    total = await db.scalar(select(func.count(Appointment.id)))
    result = await db.execute(
        select(Appointment).order_by(Appointment.created_at.desc()).offset(skip).limit(limit)
    )
    items = result.scalars().all()
    return AppointmentListOut(items=items, total=total or 0)


@router.get("/api/appointments/{appointment_id}", response_model=AppointmentOut, dependencies=[Depends(verify_admin)])
async def get_appointment(appointment_id: UUID, db: AsyncSession = Depends(get_db)):
    appt = await db.get(Appointment, appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appt


@router.delete("/api/appointments/{appointment_id}", dependencies=[Depends(verify_super_admin)])
async def delete_appointment(appointment_id: UUID, db: AsyncSession = Depends(get_db)):
    appt = await db.get(Appointment, appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    await db.delete(appt)
    await db.commit()
    return {"ok": True}


# --- Public patient endpoints ---

async def _get_by_code(short_code: str, db: AsyncSession) -> Appointment:
    result = await db.execute(select(Appointment).where(Appointment.short_code == short_code))
    appt = result.scalar_one_or_none()
    if not appt:
        raise HTTPException(status_code=404, detail="Not found")
    return appt


@router.get("/api/r/{short_code}", response_model=AppointmentOut)
async def get_public_appointment(short_code: str, db: AsyncSession = Depends(get_db)):
    return await _get_by_code(short_code, db)


@router.get("/api/r/{short_code}/ics")
async def download_ics(short_code: str, db: AsyncSession = Depends(get_db)):
    appt = await _get_by_code(short_code, db)
    appt.calendar_clicks_ics += 1
    await db.commit()
    ics_content = generate_ics(appt)
    return Response(
        content=ics_content,
        media_type="text/calendar",
        headers={
            "Content-Disposition": f'inline; filename="appointment-{short_code}.ics"',
            "Content-Type": "text/calendar; charset=utf-8",
        },
    )


@router.post("/api/r/{short_code}/track")
async def track_view(short_code: str, db: AsyncSession = Depends(get_db)):
    appt = await _get_by_code(short_code, db)
    appt.page_views += 1
    await db.commit()
    return {"ok": True}


@router.post("/api/r/{short_code}/track-google")
async def track_google(short_code: str, db: AsyncSession = Depends(get_db)):
    appt = await _get_by_code(short_code, db)
    appt.calendar_clicks_google += 1
    await db.commit()
    return {"ok": True}
