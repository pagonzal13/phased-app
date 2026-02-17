# PHASED - Premium Menstrual Cycle Management Application

A sophisticated, science-based menstrual cycle tracking and guidance application built with Next.js 14, featuring password-protected profiles, adaptive recommendations, and elegant UI design.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS with custom premium design system
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Storage**: Local-first with localStorage (optional Supabase sync)
- **Security**: PBKDF2 password hashing + AES encryption

### Core Components

1. **Cycle Engine** (`src/lib/cycleEngine.ts`)
   - Maps any cycle length (25-35 days) to relative ovulation days (O-14 to O+13)
   - Calculates phases dynamically
   - Validates cycle data

2. **Prediction System** (`src/data/predictions.ts`)
   - Phase-specific guidance for mood, energy, training, work, relationships
   - Personalizes based on profile attributes
   - Adapts to daily log data

3. **Profile Service** (`src/lib/profileService.ts`)
   - Manages profile CRUD operations
   - Generates cycle calendars
   - Handles daily logging
   - Export/import functionality

4. **Security Service** (`src/lib/security.ts`)
   - Password hashing with PBKDF2 (10,000 iterations)
   - AES encryption for sensitive data
   - Session management (30-minute expiry)

## Project Structure

```
phased-app/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── profile/
│   │   │   ├── page.tsx       # Profile picker
│   │   │   └── create/        # Profile creation wizard
│   │   ├── calendar/          # Calendar views
│   │   ├── insights/          # Analytics dashboard
│   │   └── learn/             # Theory & sources
│   │
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── PasswordModal.tsx
│   │   │   └── ...
│   │   ├── wizard/            # Questionnaire components
│   │   ├── calendar/          # Calendar components
│   │   └── dashboard/         # Analytics components
│   │
│   ├── lib/                   # Core business logic
│   │   ├── cycleEngine.ts     # Cycle calculations
│   │   ├── profileService.ts  # Data management
│   │   └── security.ts        # Encryption & auth
│   │
│   ├── data/                  # Static data & configs
│   │   ├── predictions.ts     # Phase-based guidance
│   │   └── questionnaire.ts   # Questionnaire config
│   │
│   └── types/                 # TypeScript definitions
│       └── index.ts
│
├── public/                    # Static assets
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone and install dependencies:**
```bash
cd phased-app
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open browser:**
Navigate to `http://localhost:3000`

### Docker Setup (Optional)

```bash
# Build image
docker build -t phased-app .

# Run container
docker run -p 3000:3000 phased-app
```

### Production Build

```bash
npm run build
npm start
```

## Key Features

### 1. Profile Management
- **Create**: Dynamic questionnaire with smart branching
- **Security**: Password-protected with PBKDF2 hashing
- **Privacy**: Data stored locally, encrypted sensitive fields
- **Multiple Profiles**: Support for tracking multiple cycles

### 2. Cycle Calendar
- **Relative Day Mapping**: Adapts to any cycle length (25-35 days)
- **Phase Detection**: Automatic phase assignment based on O± days
- **Personalized Predictions**: 
  - Physical & social energy
  - Emotional state
  - Cognitive function
  - Training recommendations (high/low energy options)
  - Work capacity
  - Relationship dynamics

### 3. Daily Tracking
- Mood (1-10 scale + tags)
- Energy levels
- Sleep (hours + quality)
- Stress levels
- Physical symptoms
- Training completed
- Free-form notes

### 4. Adaptive Intelligence
The system adjusts recommendations based on:
- Profile symptoms (PMS intensity, heat sensitivity, etc.)
- Recent sleep quality
- Stress levels
- Training volume
- Actual vs. predicted patterns

### 5. Insights Dashboard
- Energy patterns by phase
- Symptom peaks
- Best training windows
- Pattern recognition
- Export capabilities (PDF, CSV)

## Data Model

### Profile
```typescript
{
  id: string;
  name: string;
  cycleLength: number;              // 25-35 days
  bleedingLength: number;
  bleedingIntensity: 'light' | 'medium' | 'heavy';
  pmsIntensity: 'none' | 'mild' | 'moderate' | 'strong';
  
  // Lifestyle
  averageSleep: number;
  sleepQuality: string;
  stressLevel: string;
  trainingPreference: string;
  trainingFrequency: number;
  heatSensitive: boolean;
  
  // Symptoms
  symptoms: {
    cramps: boolean;
    bloating: boolean;
    // ... etc
  };
  
  // Security
  passwordHash: string;
  encryptedData: string;
  
  // Metadata
  lastPeriodDate: Date;
  createdAt: Date;
  lastUpdated: Date;
}
```

### Cycle Day
```typescript
{
  cycleDay: number;        // CD1-CD35
  relativeDay: number;     // O-14 to O+13
  date: Date;
  phase: PhaseInfo;
  predictions: DayPredictions;
  actualLog?: DayLog;
}
```

## Theoretical Foundation

The application implements the dataset from `dataset.md` which maps cycle physiology to 7 distinct phases:

1. **O-14 to O-10**: Menstrual / Early Follicular
2. **O-9 to O-6**: Mid Follicular (ascending)
3. **O-5 to O-3**: High Follicular
4. **O-2 to O+1**: Ovulatory Window
5. **O+2 to O+7**: Early Luteal
6. **O+8 to O+10**: Mid Luteal
7. **O+11 to O+13**: Late Luteal / Premenstrual

Each phase includes baseline predictions for:
- Energy (physical & social)
- Emotional state
- Cognition
- Self-perception
- Libido
- Training recommendations
- Work capacity
- Relationship needs
- Common risks

## Design System

### Typography
- **Display**: Cormorant Garamond (elegant, sophisticated)
- **Headings**: Playfair Display (refined, editorial)
- **Body**: Inter (clean, readable)

### Color Palette
- **Cream**: `#FAF9F6` (primary background)
- **Charcoal**: `#2B2B2B` (primary text)
- **Gold**: `#B8985F` (accents, hover states)
- **Soft Gray**: `#E8E6E3` (borders, secondary elements)
- **Deep Burgundy**: `#6B3E4A` (alerts, emphasis)

### Design Principles
- Generous whitespace
- Minimal, intentional animations
- Premium, "Vogue-like" aesthetic
- Gender-neutral, professional tone
- Accessibility-first approach

## Security & Privacy

### Data Storage
- **Local-first**: All data stored in browser localStorage by default
- **Encryption**: Sensitive fields encrypted with AES using user password
- **No server dependency**: Works completely offline

### Password Protection
- Passwords never stored in plaintext
- PBKDF2 with 10,000 iterations + unique salt per profile
- Session timeout: 30 minutes of inactivity

### Data Portability
- Export all data as JSON
- Import/restore from backup
- Complete user control

## Extending the Application

### Adding Supabase Sync

1. Install Supabase client (already in package.json)
2. Create environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

3. Create tables:
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  encrypted_data TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE logs (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles,
  log_data JSONB,
  date DATE,
  created_at TIMESTAMP
);
```

4. Enable Row Level Security (RLS)

### Adding BBT/LH Kit Integration
- Add Bluetooth API for temperature tracking devices
- Integrate with ovulation test readers
- Auto-adjust ovulation day based on actual detection

### Multi-language Support
- Extract all strings to i18n files
- Add language selector
- Translate phase descriptions

### Push Notifications
- Add service worker
- Implement reminder system for:
  - Daily logging
  - Cycle phase transitions
  - Symptom alerts

### Advanced Analytics
- ML-based pattern recognition
- Symptom clustering
- Cycle length prediction
- Anomaly detection

## Disclaimers

This application:
- ✅ Provides educational information
- ✅ Helps track and understand patterns
- ✅ Offers evidence-based guidance

This application does NOT:
- ❌ Diagnose medical conditions
- ❌ Replace medical advice
- ❌ Provide contraceptive reliability
- ❌ Treat or cure any condition

Users should consult healthcare providers for:
- Severe symptoms (PMDD, endometriosis, PCOS, etc.)
- Contraception needs
- Fertility planning
- Any medical concerns

## License

Educational use only. See LICENSE file for details.

## Credits

Built following the theoretical foundation provided in:
- `theoretical-foundation.md`
- `dataset.md`

Based on peer-reviewed research on menstrual cycle physiology and hormonal fluctuations.
