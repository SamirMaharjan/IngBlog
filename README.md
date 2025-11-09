# 📘 Blog API (Laravel 11 + Sanctum + RBAC)

## Overview
This project is a RESTful API built using **Laravel**, featuring:
- Token-based authentication via **Laravel Sanctum**
- Role-based access control (Admin, Author)
- CRUD APIs for Users, Posts, Categories, Tags, and Comments
- Polymorphic relationships for Comments and Tags
- Search and filter functionality using `spatie/laravel-query-builder`
- API Resource transformations and dynamic pagination

## ⚙️ System Requirements
- PHP >= 8.2
- Composer >= 2.6
- MySQL >= 5.7 or MariaDB >= 10.4
- Node.js (for frontend assets, optional)
- Git (recommended)

## 🚀 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2️⃣ Install dependencies
```bash
composer install
```

### 3️⃣ Copy and configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blog_api
DB_USERNAME=root
DB_PASSWORD=
```

### 4️⃣ Generate app key
```bash
php artisan key:generate
```

### 5️⃣ Run migrations and seeders
```bash
php artisan migrate --seed
```
Admin user credentials:
```
Email: admin@example.com
Password: password
```

### 6️⃣ Sanctum setup
Ensure `EnsureFrontendRequestsAreStateful::class` middleware is in `api` group.

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 7️⃣ Serve
```bash
php artisan serve
```
API URL: http://127.0.0.1:8000/api

---

## 🔐 Authentication
**POST /api/login**
```json
{
  "email": "admin@example.com",
  "password": "password"
}

Use token in header:
```
Authorization: Bearer <token>
```

---

## 👥 Roles
| Role | Permissions |
|------|--------------|
| **Admin** | Full access to manage all resources |
| **Author** | Can manage only own posts/comments |

---

## 📄 Postman collection documentation link
https://documenter.getpostman.com/view/25062418/2sB3WsQzuE

## 📄 Major API Endpoints
### Auth
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |

### Posts
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/posts` | List posts |
| POST | `/api/posts` | Create post |
| PUT | `/api/posts/{id}` | Update own post |
| DELETE | `/api/posts/{id}` | Delete own post |
| GET | `/api/posts/search` | Search posts |

### Comments
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/comments` | List comment |
| POST | `/api/comments` | Add comment |
| gGETet | `/api/comments/{id}` | view comment |
| PUT | `/api/comments/{id}` | Update own comment |
| DELETE | `/api/comments/{id}` | Delete own comment |

---
