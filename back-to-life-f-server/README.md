### 1. **Install Dependencies**
Make sure you have all the required dependencies installed. Run the following command in the root of your project:

```bash
npm install
```

---

### 2. **Set Up PostgreSQL**
1. **Ensure PostgreSQL is Running**:
   - Start the PostgreSQL service on your machine.
   - If the `psql` command is not found, ensure PostgreSQL is installed and its `bin` directory is added to your system's PATH.

2. **Create the Database**:
   If the database does not already exist and your PostgreSQL user does not have the `CREATEDB` privilege, create the database manually:
   ```bash
   psql -U postgres
   ```
   Then, run:
   ```sql
   CREATE DATABASE back_to_life_db;
   ```

---

### 3. **Set Up Prisma**
1. **Generate Prisma Client**:
   Run the following command to generate the Prisma client:
   ```bash
   npx prisma generate
   ```

2. **Run Migrations**:
   Apply the database schema defined in schema.prisma:
   ```bash
   npx prisma migrate dev --name init
   ```

---

### 4. **Set Up Environment Variables**
Create a `.env` file in the root directory with the following configuration:

```properties
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=back_to_life_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Database URL for Prisma
DATABASE_URL="postgresql://postgres:password@localhost:5432/back_to_life_db"

# Server Configuration
PORT=3000
USE_HTTPS=false

# Patient Portal URL (for setup links)
PATIENT_PORTAL_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

**Important Notes:**
- Set `USE_HTTPS=false` for development (uses HTTP)
- Set `USE_HTTPS=true` for production (requires SSL certificates in `config/ssl/`)
- The server will automatically use HTTP in development and HTTPS in production

---

### 5. **Start the Application**
Run the application in development mode using the following command:

```bash
npm run dev
```

This will start the server on port `3000`. You should see one of the following messages in the terminal:

**For HTTP (development):**
```
HTTP Server running at http://localhost:3000
```

**For HTTPS (production):**
```
HTTPS Server running at https://localhost:3000
```

---

### 6. **Test the Application**
Use tools like Postman or curl to test the API endpoints.

#### Example: Register a User
- **Endpoint**: `POST http://localhost:3000/auth/register`
- **Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

#### Example: Login a User
- **Endpoint**: `POST http://localhost:3000/auth/login`
- **Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

---

### 7. **Verify Database**
To confirm that the data is being stored in the database:
1. Connect to the PostgreSQL database:
   ```bash
   psql -U postgres -d back_to_life_db
   ```
2. Check the `User` table:
   ```sql
   SELECT * FROM "User";
   ```

---

### 8. **Optional: Build for Production**
If you want to build the app for production:
1. Compile the TypeScript code:
   ```bash
   npx tsc
   ```
2. Run the compiled code:
   ```bash
   node dist/app.js
   ```

---

### 9. **HTTPS Configuration for Production**
To enable HTTPS in production:

1. **Generate SSL Certificates**:
   Place your SSL certificate files in the `config/ssl/` directory:
   - `key.pem` - Private key
   - `cert.pem` - Certificate

2. **Set Environment Variables**:
   ```properties
   USE_HTTPS=true
   NODE_ENV=production
   ```

3. **Update Frontend Applications**:
   Update the API base URLs in your frontend applications to use HTTPS:
   ```javascript
   const API_BASE_URL = "https://localhost:3000";
   ```

---

### 10. **Frontend Applications**
The following frontend applications are configured to work with this server:

1. **Intake Form** (`back-to-life-f/`):
   - Runs on: `http://localhost:5174`
   - API: `http://localhost:3000`

2. **Clinician Portal** (`back-to-life-f 3/`):
   - Runs on: `http://localhost:5175`
   - API: `http://localhost:3000`

3. **Patient Recovery Dashboard** (`patient-recovery-dashboard/`):
   - Runs on: `http://localhost:3001`
   - API: `http://localhost:3000`

To start all applications:
```bash
# Terminal 1 - Backend Server
cd back-to-life-f-server
npm run dev

# Terminal 2 - Intake Form
cd back-to-life-f
npm run dev

# Terminal 3 - Clinician Portal
cd "back-to-life-f 3"
npm run dev

# Terminal 4 - Patient Recovery Dashboard
cd patient-recovery-dashboard
npm run dev
```