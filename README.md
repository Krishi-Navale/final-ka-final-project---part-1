# Drive Secure System — Forensic Investigation Platform (F.I.P)

An end-to-end full-stack **Forensic Investigation Platform** built with **React, Vite, Express, Mongoose (MongoDB Atlas), and Nodemailer (Gmail SMTP)**.

---

### 🚀 Quick Start Instructions (Running in VS Code)

#### 1. Download & Extract Code
Download or export the project zip file to your local computer and open the project folder in **Visual Studio Code**.

#### 2. Install Dependencies
Open a terminal in VS Code (`Ctrl + ~` or `Cmd + ~`) and run:
```bash
npm install
```

#### 3. Environment Variables Setup
The `.env` file is pre-configured with your **MongoDB Atlas connection string** and **Gmail SMTP credentials**:
```env
PORT=3000
MONGODB_URI="mongodb+srv://navalekrishi_db_user:aa6rh0FdXbOtRQ81@database.7xseu8e.mongodb.net/fip_forensic_db?retryWrites=true&w=majority&appName=Database"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_USER="navalekrishi@gmail.com"
SMTP_PASS="eghfhavgilwblofc"
```

#### 4. Launch the Development Server
Run the full-stack server (Express + Vite middleware):
```bash
npm run dev
```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

### 🗄️ Backend Features & Mongoose Collections

- **Mongoose / MongoDB Atlas**: Automatically connects to your cluster and auto-populates 5 dedicated forensic collections (`users`, `incidents`, `galleryfiles`, `investigatorworkstations`, `notifications`).
- **Gmail SMTP Email Automation**:
  1. **New Account Registration**: Sends welcome email with unique Forensic ID Number (e.g. `FIP-CITIZEN-98402`).
  2. **Evidence Upload Confirmation**: Sends tracking confirmation email when evidence is sealed in WORM Vault.
  3. **Case Resolution / Solved Report**: Sends Section 65B court certificate report upon case completion.
  4. **Hash Tampering / Security Alert**: Dispatches urgent security warnings if hash divergence is detected.

---

### 🔐 Secret Senior Investigator Terminal Access
- **Email**: `bluesapphiiire777@gmail.com`
- **Passcode**: `123456789`
- Unlocks the **Senior Investigator Workstation** with bit-level hash comparison tools, custody alerts, and court admissibility certificate generation.
