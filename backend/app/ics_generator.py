from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from app.config import CLINIC_NAME, CLINIC_PHONE, CLINIC_ADDRESS, CLINIC_TIMEZONE
from app.models import Appointment


def generate_ics(appt: Appointment) -> str:
    tz = ZoneInfo(CLINIC_TIMEZONE)
    dt_start = datetime.combine(appt.appointment_date, appt.appointment_time, tzinfo=tz)
    dt_end = dt_start + timedelta(minutes=appt.duration_minutes)

    def fmt(dt: datetime) -> str:
        return dt.strftime("%Y%m%dT%H%M%S")

    summary = f"Стоматолог — Др. {appt.doctor_name}"
    description = f"Клиника: {CLINIC_NAME}\\nТелефон: {CLINIC_PHONE}"
    if appt.notes:
        description += f"\\nПримечание: {appt.notes}"

    uid = f"{appt.id}@clinic-reminder"

    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Clinic Reminder//RU",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VTIMEZONE",
        f"TZID:{CLINIC_TIMEZONE}",
        "BEGIN:STANDARD",
        "DTSTART:19700101T000000",
        "TZOFFSETFROM:+0500",
        "TZOFFSETTO:+0500",
        "END:STANDARD",
        "END:VTIMEZONE",
        "BEGIN:VEVENT",
        f"UID:{uid}",
        f"DTSTAMP:{fmt(datetime.now(tz=tz))}",
        f"DTSTART;TZID={CLINIC_TIMEZONE}:{fmt(dt_start)}",
        f"DTEND;TZID={CLINIC_TIMEZONE}:{fmt(dt_end)}",
        f"SUMMARY:{summary}",
        f"DESCRIPTION:{description}",
        f"LOCATION:{CLINIC_ADDRESS}",
        "STATUS:CONFIRMED",
        "BEGIN:VALARM",
        "TRIGGER:-P1D",
        "ACTION:DISPLAY",
        "DESCRIPTION:Напоминание: приём у стоматолога завтра",
        "END:VALARM",
        "BEGIN:VALARM",
        "TRIGGER:-PT2H",
        "ACTION:DISPLAY",
        "DESCRIPTION:Напоминание: приём у стоматолога через 2 часа",
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR",
    ]
    return "\r\n".join(lines)
