# StayFinder

Full-stack property rental app (MERN): React + Vite + Tailwind frontend, Express + MongoDB backend.

## Features
- Register / login (JWT in httpOnly cookie), email verification, forgot/reset password
- Create, edit, delete listings with image upload (Cloudinary)
- Search & filter listings (location, type, max price, sort)
- **Bookings**: date-overlap protection, host confirm/reject, guest cancel
- **Reviews**: one per user per listing, live rating average (hosts can't review own listing)
- **Wishlist**: save/unsave listings
- Protected routes, centralised error handling, helmet / compression / rate-limit

## Setup
```bash
# backend
cd backend && npm install
# create .env (see below) then
npm run dev            # http://localhost:5000

# frontend
cd stayfinder-frontend && npm install
npm run dev            # http://localhost:5173
```

`backend/.env`
```
MONGO_URI=
PORT=5000
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLIENT_URL=http://localhost:5173
```

## API (all under `/api/v1`)
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/listings?location=&category=&minPrice=&maxPrice=&sort=` | - | Search. `sort`: newest, price_asc, price_desc, rating |
| POST | `/bookings/listing/:listingId` | yes | Body `{checkIn, checkOut, guests}` |
| GET | `/bookings/listing/:listingId/booked-dates` | - | Active booked ranges |
| GET | `/bookings/my` | yes | Bookings I made |
| GET | `/bookings/host` | yes | Requests on my listings |
| PATCH | `/bookings/:id/status` | host | Body `{status: "confirmed" \| "rejected"}` |
| PATCH | `/bookings/:id/cancel` | guest | Cancel pending/confirmed booking |
| GET | `/wishlist` | yes | Saved listings |
| POST | `/wishlist/:listingId` | yes | Toggle save |
| GET | `/health` | - | Health check |

Auth, listing and review routes are unchanged.
