import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// Permanent Default Account Credentials
// ==========================================
const PERMANENT_USER = {
  name: 'Saatwik',
  email: 'saatwik12@gmail.com',
  password: 'Saatwikss12#',
};

// ==========================================
// MongoDB Compass / Mongoose Configuration
// ==========================================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ambitiouspedia';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true, collection: 'users' }
);

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, default: 'General Inquiry' },
    message: { type: String, default: '' },
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true, collection: 'bookings' }
);

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
const BookingModel = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

const contactSchema = new mongoose.Schema(
  {
    userId: { type: String, default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, default: 'General Inquiry' },
    message: { type: String, default: '' },
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true, collection: 'contacts' }
);
const ContactModel = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

let isMongoConnected = false;

// Local JSON mirror so data persists in cloud preview AND can be imported/viewed in MongoDB Compass
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'mongodb_compass_data.json');

interface StoredUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

interface StoredBooking {
  _id: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

interface LocalDatabase {
  users: StoredUser[];
  bookings: StoredBooking[];
  contacts: StoredBooking[];
}

function readLocalDB(): LocalDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
        contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
      };
    }
  } catch (e) {
    console.error('Error reading local DB mirror:', e);
  }
  return { users: [], bookings: [], contacts: [] };
}

function writeLocalDB(data: LocalDatabase) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing local DB mirror:', e);
  }
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(derived, 'hex'));
}

function createToken(user: { id: string; name: string; email: string }): string {
  const payload = Buffer.from(JSON.stringify({ ...user, iat: Date.now() })).toString('base64url');
  const sig = crypto
    .createHmac('sha256', process.env.SESSION_SECRET || 'ambitiouspedia-mongodb-secret')
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

function verifyToken(token: string): { id: string; name: string; email: string } | null {
  try {
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return null;
    const expectedSig = crypto
      .createHmac('sha256', process.env.SESSION_SECRET || 'ambitiouspedia-mongodb-secret')
      .update(payload)
      .digest('base64url');
    if (sig !== expectedSig) return null;
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
  } catch {
    return null;
  }
}

async function seedPermanentUser() {
  const permEmail = PERMANENT_USER.email.toLowerCase();
  const permHash = hashPassword(PERMANENT_USER.password);

  // Ensure permanent user exists in local JSON mirror
  const db = readLocalDB();
  let permUserId = '';
  const existingLocal = db.users.find((u) => u.email === permEmail);
  const now = new Date().toISOString();
  if (!existingLocal) {
    permUserId = new mongoose.Types.ObjectId().toString();
    db.users.push({
      _id: permUserId,
      name: PERMANENT_USER.name,
      email: permEmail,
      passwordHash: permHash,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    permUserId = existingLocal._id;
  }

  // Seed default sample bookings if none exist yet so My Bookings page has live data immediately
  if (db.bookings.length === 0) {
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    db.bookings.push(
      {
        _id: new mongoose.Types.ObjectId().toString(),
        userId: permUserId,
        name: PERMANENT_USER.name,
        email: permEmail,
        phone: '9876543210',
        service: 'Custom Builds',
        message: 'High-performance AI workstation build with RTX GPU, 64GB DDR5 RAM & liquid cooling.',
        status: 'In Progress',
        createdAt: yesterday,
        updatedAt: now,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        userId: permUserId,
        name: PERMANENT_USER.name,
        email: permEmail,
        phone: '9876543210',
        service: 'Cloud Solutions',
        message: 'AWS & Docker cloud migration setup with automated daily backups.',
        status: 'Confirmed',
        createdAt: now,
        updatedAt: now,
      }
    );
  }
  if (db.contacts.length === 0) {
    db.contacts.push({
      _id: new mongoose.Types.ObjectId().toString(),
      userId: permUserId,
      name: PERMANENT_USER.name,
      email: permEmail,
      phone: '9876543210',
      service: 'Hardware & Software Inquiry',
      message: 'Initial contact inquiry from Contact Page.',
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    });
  }
  writeLocalDB(db);

  // Ensure permanent user, sample bookings, and sample contacts exist in MongoDB if connected
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      const existingMongo = await UserModel.findOne({ email: permEmail });
      if (!existingMongo) {
        await UserModel.create({
          name: PERMANENT_USER.name,
          email: permEmail,
          passwordHash: permHash,
        });
      }
      const bookingCount = await BookingModel.countDocuments();
      if (bookingCount === 0 && db.bookings.length > 0) {
        for (const b of db.bookings) {
          await BookingModel.create({
            userId: b.userId,
            name: b.name,
            email: b.email,
            phone: b.phone,
            service: b.service,
            message: b.message,
            status: b.status || 'Confirmed',
          });
        }
      }
      const contactCount = await ContactModel.countDocuments();
      if (contactCount === 0 && db.contacts.length > 0) {
        for (const c of db.contacts) {
          await ContactModel.create({
            userId: c.userId,
            name: c.name,
            email: c.email,
            phone: c.phone,
            service: c.service,
            message: c.message,
            status: c.status || 'Pending',
          });
        }
      }
    } catch (e) {
      console.error('Error seeding permanent user in MongoDB:', e);
    }
  }
}

async function connectMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(`Connected to MongoDB at ${MONGODB_URI}`);
  } catch (_err) {
    isMongoConnected = false;
    console.log(
      `MongoDB local instance not detected at ${MONGODB_URI} — using local JSON mirror (data/mongodb_compass_data.json) compatible with MongoDB Compass import.`
    );
  }
  await seedPermanentUser();
}

// ==========================================
// Gemini Chatbot Configuration
// ==========================================
const HARDWARE_SERVICES = [
  {
    title: 'Laptops & Desktops',
    description: 'Enterprise-grade computing solutions tailored for performance, durability, and business efficiency.',
  },
  {
    title: 'Peripherals & Accessories',
    description: 'Optimizing professional workspaces with high-quality monitors, input devices, and connectivity hubs.',
  },
  {
    title: 'Custom Builds',
    description: 'Purpose-built high-performance machines for gaming, 3D rendering, AI training, and specialized industrial tasks.',
  },
  {
    title: 'Electronic Components',
    description: 'Global sourcing of reliable semiconductors, passives, and electromechanical parts for manufacturing and repair.',
  },
  {
    title: 'Servers & Equipment',
    description: 'Scalable data center infrastructure including rack servers, storage arrays, and enterprise-grade networking.',
  },
];

const SOFTWARE_SERVICES = [
  {
    title: 'Operating Systems & Office Suites',
    description: 'Licensing and installation for Windows, macOS, Linux, Microsoft Office, Google Workspace, and more.',
  },
  {
    title: 'Antivirus & Security Software',
    description: 'Robust protection against malware, ransomware, and cyber threats to keep your data safe.',
  },
  {
    title: 'Business Management Software',
    description: 'CRM, ERP, accounting software, and project management tools to streamline your business processes.',
  },
  {
    title: 'Custom Software Development',
    description: 'Bespoke software tailored to your unique business requirements, from web applications to specialized tools.',
  },
  {
    title: 'Cloud Solutions',
    description: 'Setup and management of cloud-based services for storage, collaboration, and application hosting.',
  },
];

const hardwareInfo = HARDWARE_SERVICES.map((s) => `- ${s.title}: ${s.description}`).join('\n');
const softwareInfo = SOFTWARE_SERVICES.map((s) => `- ${s.title}: ${s.description}`).join('\n');

const SYSTEM_INSTRUCTION = `You are the friendly and professional AI assistant for "Ambitious Pedia Tech & Services".
        
        MISSION:
        Help users explore our IT solutions and encourage them to "Book a Call" for inquiries.

        OUR SERVICES:
        HARDWARE:
        ${hardwareInfo}

        SOFTWARE:
        ${softwareInfo}

        GUIDELINES:
        1. Keep responses concise (under 3-4 sentences) unless the user asks for details.
        2. Be professional, polite, and business-oriented.
        3. If a user asks about pricing, say "Pricing depends on specific requirements. Please book a call for a tailored quote."
        4. If you don't know the answer, ask them to "Book a Call" to speak with an expert.
        5. Your tone should be helpful and innovative.`;

function getGeminiClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  await connectMongoDB();

  const app = express();
  const PORT = Number(process.env.PORT || 3001);

  app.use(express.json());

  // ==========================================
  // Auth API Routes (MongoDB Compass backed)
  // ==========================================
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Name, Email ID, and Password are required.' });
        return;
      }

      if (confirmPassword !== undefined && password !== confirmPassword) {
        res.status(400).json({ error: 'Passwords do not match. Please enter the same password twice.' });
        return;
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const trimmedName = String(name).trim();
      const rawPassword = String(password);

      const hasMinLength = rawPassword.length >= 8;
      const hasUpper = /[A-Z]/.test(rawPassword);
      const hasLower = /[a-z]/.test(rawPassword);
      const hasNumber = /[0-9]/.test(rawPassword);
      const hasSymbol = /[^A-Za-z0-9\s]/.test(rawPassword);

      if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSymbol) {
        res.status(400).json({
          error:
            'Please create a strong password: Use 8 or more characters with a mix of uppercase & lowercase letters, numbers, and symbols.',
        });
        return;
      }

      const passwordHash = hashPassword(rawPassword);

      // Check existing user in MongoDB or local mirror
      if (isMongoConnected && mongoose.connection.readyState === 1) {
        const existing = await UserModel.findOne({ email: normalizedEmail });
        if (existing) {
          res.status(409).json({ error: 'An account with this Email ID already exists. Please login.' });
          return;
        }
        const created = await UserModel.create({
          name: trimmedName,
          email: normalizedEmail,
          passwordHash,
        });

        // Also sync to local JSON mirror
        const db = readLocalDB();
        if (!db.users.some((u) => u.email === normalizedEmail)) {
          db.users.push({
            _id: String(created._id),
            name: created.name,
            email: created.email,
            passwordHash,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          writeLocalDB(db);
        }

        const userPayload = { id: String(created._id), name: created.name, email: created.email };
        res.status(201).json({
          message: 'Account created successfully. Please login with your credentials.',
          user: userPayload,
        });
        return;
      }

      // Fallback mirror when local MongoDB is not running in cloud preview
      const db = readLocalDB();
      if (db.users.some((u) => u.email === normalizedEmail)) {
        res.status(409).json({ error: 'An account with this Email ID already exists. Please login.' });
        return;
      }

      const newId = new mongoose.Types.ObjectId().toString();
      const now = new Date().toISOString();
      const newUser: StoredUser = {
        _id: newId,
        name: trimmedName,
        email: normalizedEmail,
        passwordHash,
        createdAt: now,
        updatedAt: now,
      };
      db.users.push(newUser);
      writeLocalDB(db);

      const userPayload = { id: newUser._id, name: newUser.name, email: newUser.email };
      res.status(201).json({
        message: 'Account created successfully. Please login with your credentials.',
        user: userPayload,
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Failed to create account. Please try again.' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email ID and Password are required.' });
        return;
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const rawPassword = String(password);

      if (isMongoConnected && mongoose.connection.readyState === 1) {
        const userDoc = await UserModel.findOne({ email: normalizedEmail });
        if (userDoc && verifyPassword(rawPassword, userDoc.passwordHash)) {
          const userPayload = { id: String(userDoc._id), name: userDoc.name, email: userDoc.email };
          const token = createToken(userPayload);
          res.json({ user: userPayload, token });
          return;
        }
      }

      const db = readLocalDB();
      const userDoc = db.users.find((u) => u.email === normalizedEmail);
      if (userDoc && verifyPassword(rawPassword, userDoc.passwordHash)) {
        const userPayload = { id: userDoc._id, name: userDoc.name, email: userDoc.email };
        const token = createToken(userPayload);
        res.json({ user: userPayload, token });
        return;
      }

      // Direct fallback check for permanent login credentials
      if (
        normalizedEmail === PERMANENT_USER.email.toLowerCase() &&
        rawPassword === PERMANENT_USER.password
      ) {
        const userPayload = {
          id: userDoc ? userDoc._id : 'permanent-saatwik-id',
          name: userDoc ? userDoc.name : PERMANENT_USER.name,
          email: PERMANENT_USER.email,
        };
        const token = createToken(userPayload);
        res.json({ user: userPayload, token });
        return;
      }

      res.status(401).json({ error: 'Invalid Email ID or Password.' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to log in. Please try again.' });
    }
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    res.json({ user: decoded });
  });

  app.put('/api/auth/profile', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const token = authHeader.slice(7);
      const decoded = verifyToken(token);
      if (!decoded) {
        res.status(401).json({ error: 'Invalid or expired session. Please login again.' });
        return;
      }

      const { name, password, confirmPassword } = req.body;
      const trimmedName = name !== undefined ? String(name).trim() : decoded.name;

      if (!trimmedName) {
        res.status(400).json({ error: 'Name cannot be empty.' });
        return;
      }

      let newPasswordHash: string | undefined;
      if (password && String(password).length > 0) {
        const rawPassword = String(password);
        if (confirmPassword !== undefined && rawPassword !== String(confirmPassword)) {
          res.status(400).json({ error: 'Passwords do not match. Please enter the same password twice.' });
          return;
        }

        const hasMinLength = rawPassword.length >= 8;
        const hasUpper = /[A-Z]/.test(rawPassword);
        const hasLower = /[a-z]/.test(rawPassword);
        const hasNumber = /[0-9]/.test(rawPassword);
        const hasSymbol = /[^A-Za-z0-9\s]/.test(rawPassword);

        if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSymbol) {
          res.status(400).json({
            error:
              'Please create a strong password: Use 8 or more characters with a mix of uppercase & lowercase letters, numbers, and symbols.',
          });
          return;
        }
        newPasswordHash = hashPassword(rawPassword);
      }

      const normalizedEmail = decoded.email.toLowerCase();
      let updatedId = decoded.id;

      // Update in MongoDB if connected
      if (isMongoConnected && mongoose.connection.readyState === 1) {
        const updateFields: Record<string, string> = { name: trimmedName };
        if (newPasswordHash) {
          updateFields.passwordHash = newPasswordHash;
        }
        const updatedDoc = await UserModel.findOneAndUpdate(
          { email: normalizedEmail },
          { $set: updateFields },
          { new: true }
        );
        if (updatedDoc) {
          updatedId = String(updatedDoc._id);
        }
      }

      // Also update in local JSON mirror
      const db = readLocalDB();
      const localUser = db.users.find((u) => u.email === normalizedEmail);
      const now = new Date().toISOString();
      if (localUser) {
        localUser.name = trimmedName;
        if (newPasswordHash) {
          localUser.passwordHash = newPasswordHash;
        }
        localUser.updatedAt = now;
        updatedId = localUser._id;
      } else {
        db.users.push({
          _id: updatedId,
          name: trimmedName,
          email: normalizedEmail,
          passwordHash: newPasswordHash || hashPassword(PERMANENT_USER.password),
          createdAt: now,
          updatedAt: now,
        });
      }
      writeLocalDB(db);

      const updatedUser = {
        id: updatedId,
        name: trimmedName,
        email: decoded.email,
      };
      const newToken = createToken(updatedUser);

      res.json({
        message: 'Credentials updated successfully!',
        user: updatedUser,
        token: newToken,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update credentials. Please try again.' });
    }
  });

  // ==========================================
  // Status Normalization & MongoDB Compass Sync
  // ==========================================
  function normalizeStatus(raw?: string): string {
    if (!raw) return 'Pending';
    const s = String(raw).trim().toLowerCase();
    if (s === 'completed' || s === 'complete' || s === 'done' || s === 'delivered' || s === 'finished') {
      return 'Completed';
    }
    if (
      s === 'in progress' ||
      s === 'in-progress' ||
      s === 'inprogress' ||
      s === 'processing' ||
      s === 'active' ||
      s === 'ongoing' ||
      s === 'working'
    ) {
      return 'In Progress';
    }
    if (s === 'confirmed' || s === 'confirm' || s === 'approved' || s === 'accepted' || s === 'scheduled') {
      return 'Confirmed';
    }
    if (s === 'cancelled' || s === 'canceled' || s === 'rejected') {
      return 'Cancelled';
    }
    if (s === 'pending' || s === 'new' || s === 'open' || s === 'waiting') {
      return 'Pending';
    }
    return String(raw).trim();
  }

  // Tracks last synced status per document pair so changes made in EITHER
  // 'contacts' OR 'bookings' inside MongoDB Compass propagate to the website immediately
  const lastSyncedPairStatus = new Map<string, string>();

  async function syncContactsAndBookingsInMongo() {
    if (!isMongoConnected || mongoose.connection.readyState !== 1) return;
    try {
      const [allBookings, allContacts] = await Promise.all([
        BookingModel.find({}).lean(),
        ContactModel.find({}).lean(),
      ]);

      // Normalize any non-standard status strings directly edited in bookings
      for (const b of allBookings) {
        const normB = normalizeStatus(b.status as string);
        if (b.status !== normB) {
          await BookingModel.updateOne({ _id: b._id }, { $set: { status: normB } });
          b.status = normB;
        }
      }

      for (const c of allContacts) {
        const normC = normalizeStatus(c.status as string);
        if (c.status !== normC) {
          await ContactModel.updateOne({ _id: c._id }, { $set: { status: normC } });
          c.status = normC;
        }

        // Find matching booking by shared _id OR by matching contact fields (for older entries)
        const matchedBooking = allBookings.find(
          (b) =>
            String(b._id) === String(c._id) ||
            (String(b.email || '').toLowerCase() === String(c.email || '').toLowerCase() &&
              String(b.phone || '') === String(c.phone || '') &&
              String(b.service || '') === String(c.service || '') &&
              String(b.message || '') === String(c.message || ''))
        );

        if (matchedBooking) {
          const pairKey = String(matchedBooking._id);
          const bStatus = normalizeStatus(matchedBooking.status as string);
          const cStatus = normalizeStatus(c.status as string);
          let resolvedStatus = bStatus;

          if (cStatus !== bStatus) {
            const prevStatus = lastSyncedPairStatus.get(pairKey);
            if (prevStatus) {
              if (cStatus !== prevStatus) {
                resolvedStatus = cStatus;
              } else if (bStatus !== prevStatus) {
                resolvedStatus = bStatus;
              }
            } else {
              // First sync after server boot: if one collection was updated away from 'Pending', prefer it
              if (cStatus !== 'Pending' && bStatus === 'Pending') {
                resolvedStatus = cStatus;
              } else if (bStatus !== 'Pending' && cStatus === 'Pending') {
                resolvedStatus = bStatus;
              } else {
                resolvedStatus = cStatus;
              }
            }

            if (matchedBooking.status !== resolvedStatus) {
              await BookingModel.updateOne(
                { _id: matchedBooking._id },
                { $set: { status: resolvedStatus } }
              );
              matchedBooking.status = resolvedStatus;
            }
            if (c.status !== resolvedStatus) {
              await ContactModel.updateOne({ _id: c._id }, { $set: { status: resolvedStatus } });
              c.status = resolvedStatus;
            }
          }

          lastSyncedPairStatus.set(pairKey, resolvedStatus);
        } else {
          // Contact exists in 'contacts' but not in 'bookings' — mirror it so My Bookings shows it
          const created = await BookingModel.create({
            _id: c._id,
            userId: c.userId || null,
            name: c.name,
            email: c.email,
            phone: c.phone,
            service: c.service || 'General Inquiry',
            message: c.message || '',
            status: normC,
          });
          lastSyncedPairStatus.set(String(created._id), normC);
        }
      }
    } catch (err) {
      console.error('Error syncing contacts and bookings in MongoDB:', err);
    }
  }

  // ==========================================
  // Bookings / Inquiries API (MongoDB Compass)
  // ==========================================
  app.get('/api/bookings', async (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      const emailFilter = req.query.email ? String(req.query.email).trim().toLowerCase() : null;
      const userIdFilter = req.query.userId ? String(req.query.userId).trim() : null;

      if (isMongoConnected && mongoose.connection.readyState === 1) {
        await syncContactsAndBookingsInMongo();

        const query: Record<string, unknown> = {};
        if (emailFilter && userIdFilter) {
          query.$or = [{ email: emailFilter }, { userId: userIdFilter }];
        } else if (emailFilter) {
          query.email = emailFilter;
        } else if (userIdFilter) {
          query.userId = userIdFilter;
        }
        const docs = await BookingModel.find(query).sort({ createdAt: -1 }).lean();
        const normalizedDocs = docs.map((d) => ({
          ...d,
          status: normalizeStatus(d.status as string),
        }));
        res.json({ bookings: normalizedDocs });
        return;
      }

      const db = readLocalDB();
      let list = [...db.bookings];
      if (emailFilter || userIdFilter) {
        list = list.filter(
          (b) =>
            (emailFilter && b.email.toLowerCase() === emailFilter) ||
            (userIdFilter && b.userId === userIdFilter)
        );
      }
      list = list.map((b) => ({ ...b, status: normalizeStatus(b.status) }));
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json({ bookings: list });
    } catch (error) {
      console.error('Fetch bookings error:', error);
      res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
  });

  app.post('/api/bookings', async (req, res) => {
    try {
      const { name, email, phone, service, message, userId } = req.body;
      if (!name || !email || !phone) {
        res.status(400).json({ error: 'Name, Email ID, and Phone Number are required.' });
        return;
      }

      const cleanedPhone = String(phone).replace(/\D/g, '');
      if (cleanedPhone.length !== 10) {
        res.status(400).json({ error: 'Phone number must be a valid 10-digit number.' });
        return;
      }

      const now = new Date().toISOString();
      const initialStatus = 'Pending';

      if (isMongoConnected && mongoose.connection.readyState === 1) {
        const created = await BookingModel.create({
          userId: userId || null,
          name: String(name).trim(),
          email: String(email).trim().toLowerCase(),
          phone: cleanedPhone,
          service: service || 'General Inquiry',
          message: message || '',
          status: initialStatus,
        });

        const db = readLocalDB();
        db.bookings.push({
          _id: String(created._id),
          userId: userId || null,
          name: created.name,
          email: created.email,
          phone: created.phone,
          service: created.service,
          message: created.message,
          status: created.status || initialStatus,
          createdAt: now,
          updatedAt: now,
        });
        writeLocalDB(db);

        res.status(201).json({ booking: created });
        return;
      }

      const db = readLocalDB();
      const newBooking: StoredBooking = {
        _id: new mongoose.Types.ObjectId().toString(),
        userId: userId || null,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: cleanedPhone,
        service: service || 'General Inquiry',
        message: message || '',
        status: initialStatus,
        createdAt: now,
        updatedAt: now,
      };
      db.bookings.push(newBooking);
      writeLocalDB(db);

      res.status(201).json({ booking: newBooking });
    } catch (error) {
      console.error('Booking error:', error);
      res.status(500).json({ error: 'Failed to save booking.' });
    }
  });

  app.put('/api/bookings/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { service, phone, message, status } = req.body;
      const now = new Date().toISOString();

      let cleanedPhone: string | undefined;
      if (phone !== undefined) {
        cleanedPhone = String(phone).replace(/\D/g, '');
        if (cleanedPhone.length !== 10) {
          res.status(400).json({ error: 'Phone number must be a valid 10-digit number.' });
          return;
        }
      }

      let updatedDoc: unknown = null;

      if (isMongoConnected && mongoose.connection.readyState === 1) {
        const existingBooking = await BookingModel.findById(id).lean();
        const updateFields: Record<string, string> = {};
        if (service !== undefined) updateFields.service = String(service).trim();
        if (cleanedPhone !== undefined) updateFields.phone = cleanedPhone;
        if (message !== undefined) updateFields.message = String(message);
        if (status !== undefined) updateFields.status = normalizeStatus(String(status));

        updatedDoc = await BookingModel.findByIdAndUpdate(
          id,
          { $set: updateFields },
          { new: true }
        ).lean();

        // Also keep corresponding ContactModel entry in sync
        const updatedContact = await ContactModel.findByIdAndUpdate(
          id,
          { $set: updateFields },
          { new: true }
        ).lean();

        if (!updatedContact && existingBooking) {
          await ContactModel.updateMany(
            {
              email: existingBooking.email,
              phone: existingBooking.phone,
              service: existingBooking.service,
            },
            { $set: updateFields }
          );
        }

        if (updateFields.status) {
          lastSyncedPairStatus.set(String(id), updateFields.status);
        }
      }

      const db = readLocalDB();
      const idx = db.bookings.findIndex((b) => b._id === id);
      if (idx !== -1) {
        if (service !== undefined) db.bookings[idx].service = String(service).trim();
        if (cleanedPhone !== undefined) db.bookings[idx].phone = cleanedPhone;
        if (message !== undefined) db.bookings[idx].message = String(message);
        if (status !== undefined) db.bookings[idx].status = normalizeStatus(String(status));
        db.bookings[idx].updatedAt = now;
        if (!updatedDoc) {
          updatedDoc = db.bookings[idx];
        }
      }
      const cIdx = db.contacts.findIndex((c) => c._id === id);
      if (cIdx !== -1) {
        if (service !== undefined) db.contacts[cIdx].service = String(service).trim();
        if (cleanedPhone !== undefined) db.contacts[cIdx].phone = cleanedPhone;
        if (message !== undefined) db.contacts[cIdx].message = String(message);
        if (status !== undefined) db.contacts[cIdx].status = normalizeStatus(String(status));
        db.contacts[cIdx].updatedAt = now;
      }
      if (idx !== -1 || cIdx !== -1) {
        writeLocalDB(db);
      }

      if (!updatedDoc) {
        res.status(404).json({ error: 'Booking not found.' });
        return;
      }

      res.json({ booking: updatedDoc, message: 'Booking updated successfully.' });
    } catch (error) {
      console.error('Update booking error:', error);
      res.status(500).json({ error: 'Failed to update booking.' });
    }
  });

  app.delete('/api/bookings/:id', async (req, res) => {
    try {
      const { id } = req.params;

      if (isMongoConnected && mongoose.connection.readyState === 1) {
        const existingBooking = await BookingModel.findById(id).lean();
        await BookingModel.findByIdAndDelete(id);
        const deletedContact = await ContactModel.findByIdAndDelete(id);
        if (!deletedContact && existingBooking) {
          await ContactModel.deleteOne({
            email: existingBooking.email,
            phone: existingBooking.phone,
            service: existingBooking.service,
            message: existingBooking.message,
          });
        }
        lastSyncedPairStatus.delete(String(id));
      }

      const db = readLocalDB();
      const initialLen = db.bookings.length + db.contacts.length;
      db.bookings = db.bookings.filter((b) => b._id !== id);
      db.contacts = db.contacts.filter((c) => c._id !== id);
      if (db.bookings.length + db.contacts.length !== initialLen) {
        writeLocalDB(db);
      }

      res.json({ message: 'Booking removed from database.' });
    } catch (error) {
      console.error('Delete booking error:', error);
      res.status(500).json({ error: 'Failed to delete booking.' });
    }
  });

  // ==========================================
  // Contact Page Submissions API (MongoDB Compass)
  // ==========================================
  app.get('/api/contacts', async (_req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      if (isMongoConnected && mongoose.connection.readyState === 1) {
        await syncContactsAndBookingsInMongo();
        const docs = await ContactModel.find({}).sort({ createdAt: -1 }).lean();
        const normalizedDocs = docs.map((d) => ({
          ...d,
          status: normalizeStatus(d.status as string),
        }));
        res.json({ contacts: normalizedDocs });
        return;
      }
      const db = readLocalDB();
      const list = [...db.contacts]
        .map((c) => ({ ...c, status: normalizeStatus(c.status) }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json({ contacts: list });
    } catch (error) {
      console.error('Fetch contacts error:', error);
      res.status(500).json({ error: 'Failed to fetch contact submissions.' });
    }
  });

  app.post('/api/contacts', async (req, res) => {
    try {
      const { name, email, phone, service, message, userId } = req.body;
      if (!name || !email || !phone) {
        res.status(400).json({ error: 'Name, Email ID, and Phone Number are required.' });
        return;
      }

      const cleanedPhone = String(phone).replace(/\D/g, '');
      if (cleanedPhone.length !== 10) {
        res.status(400).json({ error: 'Phone number must be a valid 10-digit number.' });
        return;
      }

      const now = new Date().toISOString();
      const initialStatus = 'Pending';
      const normalizedName = String(name).trim();
      const normalizedEmail = String(email).trim().toLowerCase();
      const normalizedService = service || 'General Inquiry';
      const normalizedMessage = message || '';

      // Share the exact same _id across 'contacts' and 'bookings' so updating status in either
      // collection inside MongoDB Compass updates the website immediately
      const sharedId = new mongoose.Types.ObjectId();

      if (isMongoConnected && mongoose.connection.readyState === 1) {
        const createdContact = await ContactModel.create({
          _id: sharedId,
          userId: userId || null,
          name: normalizedName,
          email: normalizedEmail,
          phone: cleanedPhone,
          service: normalizedService,
          message: normalizedMessage,
          status: initialStatus,
        });

        const createdBooking = await BookingModel.create({
          _id: sharedId,
          userId: userId || null,
          name: normalizedName,
          email: normalizedEmail,
          phone: cleanedPhone,
          service: normalizedService,
          message: normalizedMessage,
          status: initialStatus,
        });

        lastSyncedPairStatus.set(String(sharedId), initialStatus);

        const db = readLocalDB();
        const storedRecord: StoredBooking = {
          _id: String(sharedId),
          userId: userId || null,
          name: normalizedName,
          email: normalizedEmail,
          phone: cleanedPhone,
          service: normalizedService,
          message: normalizedMessage,
          status: initialStatus,
          createdAt: now,
          updatedAt: now,
        };
        db.contacts.push(storedRecord);
        db.bookings.push({ ...storedRecord });
        writeLocalDB(db);

        res.status(201).json({ contact: createdContact, booking: createdBooking });
        return;
      }

      const db = readLocalDB();
      const newContact: StoredBooking = {
        _id: String(sharedId),
        userId: userId || null,
        name: normalizedName,
        email: normalizedEmail,
        phone: cleanedPhone,
        service: normalizedService,
        message: normalizedMessage,
        status: initialStatus,
        createdAt: now,
        updatedAt: now,
      };
      db.contacts.push(newContact);
      db.bookings.push({ ...newContact });
      writeLocalDB(db);

      res.status(201).json({ contact: newContact, booking: newContact });
    } catch (error) {
      console.error('Contact submission error:', error);
      res.status(500).json({ error: 'Failed to save contact details.' });
    }
  });

  // ==========================================
  // Gemini Chat API Route
  // ==========================================
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const ai = getGeminiClient();
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: Array.isArray(history) ? history : [],
      });

      const result = await chat.sendMessage({ message });
      res.json({ text: result.text || '' });
    } catch (error) {
      console.error('Gemini API Error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate response from Gemini API';
      res.status(500).json({
        error: errorMessage,
      });
    }
  });

  // Frontend runs independently in client/ on port 3000.
  // This Express process serves API routes only.

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
