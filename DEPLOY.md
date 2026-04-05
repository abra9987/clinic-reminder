# Deployment Notes

## URLs
- **Production:** https://clinic.raulgumerov.com
- **Admin password:** set via ADMIN_PASSWORD env in Coolify (current: stomatolog2026)

## Architecture
```
Russian users → VDSina bridge (89.124.102.116, nginx+SSL)
                  → Hetzner Helsinki (77.42.31.110, Coolify/Traefik)
                      → frontend (nginx, React SPA, proxies /api/)
                      → backend (FastAPI, port 8000)
                      → shared-postgres (clinic_reminder database)
```

## Coolify
- Project UUID: zz2cjwedmkpu5761c1cnkifh
- App UUID: shx4f07jnc20t50f8m58ogtx
- Repo: github.com/abra9987/clinic-reminder (public)

## DNS (Cloudflare)
- `clinic.raulgumerov.com` → 89.124.102.116 (VDSina, DNS only)
- Record ID: 3c7caffea2714c637eadfbcd84a9f3e6

## SSL
- VDSina: Let's Encrypt via certbot, auto-renew, expires 2026-07-03
- Hetzner: Let's Encrypt via Coolify/Traefik

## Database
- Shared PostgreSQL in Coolify (Shared Infrastructure project)
- DB name: clinic_reminder
- Internal: postgres://postgres:***@msaxb1gvzcczmdu2aalkeugb:5432/clinic_reminder
