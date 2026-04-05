import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://clinic:changeme@localhost:5432/clinic_reminder")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "clinicadmin2026")
SUPER_ADMIN_PASSWORD = os.getenv("SUPER_ADMIN_PASSWORD", "superadmin2026")

CLINIC_NAME = "Мой стоматолог"
CLINIC_PHONE = "+7 917 422 33 84"
CLINIC_ADDRESS = "г. Уфа, ул. Достоевского, 73"
CLINIC_TIMEZONE = "Asia/Yekaterinburg"
