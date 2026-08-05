# CampusEats API

1. Create a MySQL database by running `config/schema.sql`.
2. Copy `.env.example` to `.env` and set your database credentials plus a strong `JWT_SECRET`.
3. Run `npm install` inside this folder, then `npm run dev`.

Base URL: `http://localhost:5000/api`

Authentication endpoints:

- `POST /auth/customer/register`
- `POST /auth/customer/login`
- `POST /auth/restaurant/login`
- `POST /auth/rider/login`
- `POST /auth/admin/login`

Protected endpoints require `Authorization: Bearer <token>`. Role APIs are mounted at `/customer`, `/restaurant`, `/rider`, and `/admin`.

The schema intentionally uses a shared `users` identity table in addition to the requested role tables. It provides one secure password/identity record per account; `customers`, `restaurants`, `delivery_riders`, and `admins` hold role-specific data.
