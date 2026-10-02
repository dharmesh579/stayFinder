# 🏠 StayFinder

A full-stack property rental platform where guests can search and book stays, and hosts can list properties and manage booking requests. Built with the MERN stack.

## 🔗 Live Demo

| | Link |
|---|---|
| **Frontend** | https://stay-finder-navy-two.vercel.app |
| **Backend API** | https://stayfinder-gt8y.onrender.com/api/v1 |
| **Source code** | https://github.com/dharmesh579/stayFinder |

> The backend is hosted on Render's free tier, so the first request after a period of inactivity can take 30-60 seconds while the server wakes up.

## ✨ Features

**Guests**
- Register and login with JWT authentication (httpOnly cookies)
- Email verification and forgot / reset password
- Search listings by location, filter by property type and max price, sort by newest, price or rating
- View listing details with an image gallery, host info and reviews
- Book a stay by choosing dates and guests, with total price calculation and double-booking protection
- Track and cancel bookings from **My Bookings**
- Save favourite properties to a **Wishlist**
- Write and delete reviews (one review per user per listing)

**Hosts**
- Create, edit and delete listings with image upload (Cloudinary)
- Manage listings from **My Listings**
- Confirm or reject incoming requests from **Booking Requests**

**Platform**
- Protected routes, centralised error handling, request validation (Zod)
- Security hardening with Helmet, rate limiting on auth routes and compression
- Fully responsive UI

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, React Router, Tailwind CSS, Axios, React Icons |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | JWT, bcrypt, cookie-parser, Nodemailer |
| Media | Cloudinary, Multer |
| Validation | Zod |
| Hosting | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## 📁 Project Structure

```
stayFinder/
├── backend/
│   └── src/
│       ├── config/          # env, db, cloudinary, cookies
│       ├── controllers/     # request handlers
│       ├── middleware/      # auth, validation, upload, errors
│       ├── models/          # User, Listing, Review, Booking
│       ├── routes/          # API routes
│       ├── services/        # business logic
│       ├── validators/      # Zod schemas
│       ├── app.js
│       └── server.js
└── stayfinder-frontend/
    └── src/
        ├── components/      # Navbar, Hero, SearchBar, ListingCard, Reviews...
        ├── context/         # AuthContext
        ├── layouts/
        ├── pages/           # Home, ListingDetails, MyListings, MyBookings...
        ├── router/
        ├── services/        # API calls
        └── utils/
```

## 🚀 Run Locally

**Prerequisites:** Node.js 18+, a MongoDB database (local or Atlas), and a Cloudinary account.

```bash
git clone https://github.com/dharmesh579/stayFinder.git
cd stayFinder
```

**1. Backend**

```bash
cd backend
npm install
cp .env.example .env     # then fill in your values
npm run dev              # http://localhost:5000
```

**2. Frontend**

```bash
cd stayfinder-frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

## 🔐 Environment Variables

**`backend/.env`**

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign tokens |
| `CLIENT_URL` | Frontend URL for CORS and email links, no trailing slash |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `EMAIL_USER` / `EMAIL_PASS` | SMTP account (use an app password) for verification and reset emails |

**`stayfinder-frontend/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL, e.g. `http://localhost:5000/api/v1` |

## ☁️ Deployment

**Backend on Render**
- Root directory `backend`, build command `npm install`, start command `npm start`
- Set `NODE_ENV=production` and `CLIENT_URL=https://stay-finder-navy-two.vercel.app`, plus the other variables above

**Frontend on Vercel**
- Root directory `stayfinder-frontend`, framework preset Vite
- Set `VITE_API_URL=https://stayfinder-gt8y.onrender.com/api/v1`
- `vercel.json` rewrites all routes to `index.html` so page refreshes work

## 📡 API Reference

All routes are prefixed with `/api/v1`.

**Auth** `/auth`: register, login, logout, profile, email verification, forgot and reset password

**Listings** `/listings`

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/listings?location=&category=&minPrice=&maxPrice=&sort=` | - | Search and filter. `sort`: `newest`, `price_asc`, `price_desc`, `rating` |
| GET | `/listings/:id` | - | Listing details |
| POST / PUT / DELETE | `/listings`, `/listings/:id` | Host | Create, update, delete |

**Bookings** `/bookings`

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/bookings/listing/:listingId` | Yes | Create booking `{checkIn, checkOut, guests}` |
| GET | `/bookings/listing/:listingId/booked-dates` | - | Already booked date ranges |
| GET | `/bookings/my` | Yes | Bookings I made |
| GET | `/bookings/host` | Yes | Requests on my listings |
| PATCH | `/bookings/:id/status` | Host | `{status: "confirmed" \| "rejected"}` |
| PATCH | `/bookings/:id/cancel` | Guest | Cancel a booking |

**Reviews** `/reviews`: list, create and delete reviews per listing

**Wishlist** `/wishlist`: `GET /` saved listings, `POST /:listingId` toggle save

## 🗺️ Roadmap

- Online payments (Razorpay / Stripe)
- Admin dashboard
- Maps integration and image galleries per listing
- Guest-count limits per property

## 👤 Author

**Dharmesh** · [@dharmesh579](https://github.com/dharmesh579)
