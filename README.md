# Travelist - Booking Management App

This is the internal tool to manage bookings of customers and manage the team member/staff schedules to subjecting to their availability. The idea of not only calendly fascinated me but how things would be manage both on the front facing user and on the staff's side.

## Features

- 🛠️ Demo credentials at login
- 👮 Auth Role privileges
- 🌎 Data table with multiple filters
- 📝 CRUD (Create, Read, Update, Delete) for bookings, schedules and users
- 📱 Responsive Design
- ➡️ Modals and Intercepting routes
- 🔍 Server side querying of data table (SOON)

## Auth Roles

| Role              | Create   | Read                               | Update                             | Delete                             |
| :---------------- | :------- | :--------------------------------- | :--------------------------------- | :--------------------------------- |
| staff             | schedule | bookings, profile, schedule        | schedule, bookings                 | schedule                           |
| admin             | schedule | bookings, profile, schedule        | schedule, bookings                 | schedule, bookings                 |
| owner / developer | schedule | users, bookings, profile, schedule | users, bookings, profile, schedule | users, bookings, profile, schedule |

## Technologies

- React / Next JS
- Tailwind CSS
- Typescript
- Shadcn UI component library
- Drizzle
- Supabase storage and postgresql
- Lucia Auth
