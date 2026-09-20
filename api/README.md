# FixDesk API

Backend API untuk FixDesk - Sistem Manajemen Tiket Servis

## Setup

1. Copy `.env.example` ke `.env` dan sesuaikan konfigurasi database
2. Install dependencies:
```bash
cd api
npm install
```

3. Buat database PostgreSQL:
```bash
createdb fixdesk
```

4. Jalankan migration:
```bash
psql -U postgres -d fixdesk -f ../database/schema.sql
psql -U postgres -d fixdesk -f ../database/seed.sql
```

5. Jalankan server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login user
- POST `/api/auth/register` - Register user (owner only)

### Tickets
- GET `/api/tickets` - List all tickets
- POST `/api/tickets` - Create new ticket
- GET `/api/tickets/:id` - Get ticket detail
- PATCH `/api/tickets/:id` - Update ticket
- GET `/api/tickets/track/:token` - Public tracking

### Customers
- GET `/api/customers` - List customers
- POST `/api/customers` - Create customer
- GET `/api/customers/:id` - Get customer detail

### Spare Parts
- GET `/api/parts` - List spare parts
- POST `/api/parts` - Create spare part
- PATCH `/api/parts/:id` - Update spare part

### Invoices
- POST `/api/invoices` - Create invoice
- GET `/api/invoices/:id` - Get invoice detail
