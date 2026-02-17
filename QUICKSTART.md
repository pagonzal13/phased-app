# PHASED - Quick Start Guide

## Getting Started in 5 Minutes

### Option 1: Local Development (Recommended for testing)

```bash
# Navigate to project directory
cd phased-app

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

That's it! The app will be running locally.

### Option 2: Docker

```bash
# Build the image
docker build -t phased-app .

# Run the container
docker run -p 3000:3000 phased-app

# Access at http://localhost:3000
```

## First Steps in the App

### 1. Create Your First Profile

1. Click "Create Profile" on the landing page
2. Answer the questionnaire (takes 2-3 minutes)
   - Basic cycle info (length, bleeding, PMS)
   - Lifestyle (sleep, stress, training)
   - Symptoms you typically experience
3. Set a secure password (min. 8 characters)
4. Click "Create Profile"

### 2. Explore Your Calendar

You'll be automatically redirected to your personalized calendar showing:

- **Grid View**: See your entire cycle at a glance
- **Timeline View**: Detailed day-by-day breakdown
- **Phase Colors**: Visual coding for each cycle phase
- **Today Marker**: Gold ring shows current day

### 3. View Day Details

Click any day to see:
- Predicted energy levels
- Mood and emotional state
- Cognition patterns
- Training recommendations (high/low energy options)
- Work capacity guidance
- Relationship dynamics
- Potential risks to be aware of

### 4. Start Tracking (Optional but Recommended)

Click "Log This Day" to record:
- Actual mood and energy
- Sleep quality and hours
- Stress levels
- Physical symptoms
- Training completed
- Notes

The app will use this data to personalize future recommendations.

## Key Features

### Password Protection
- Each profile is password-protected
- Sessions expire after 30 minutes of inactivity
- Sensitive data is encrypted

### Multiple Profiles
- Track multiple cycles (useful for research, comparison, or different people using the app)
- Each profile is completely isolated

### Data Export
- Export your entire profile and logs as JSON
- Use for backup or analysis
- Complete data portability

### Offline-First
- All data stored locally in your browser
- No internet required after initial load
- Optional cloud sync with Supabase (requires setup)

## Common Questions

**Q: How accurate are the predictions?**
A: Predictions are based on research averages. Individual experience varies—that's why daily tracking is important to personalize the guidance.

**Q: Can I use this for birth control?**
A: Absolutely not. This app is educational only and should never be used as contraception.

**Q: What if my cycle is irregular?**
A: The app works for cycles 25-35 days. If your cycles vary significantly, use the average length and track closely.

**Q: Will my password be stored?**
A: No. Passwords are hashed using PBKDF2 with 10,000 iterations. Even if someone accessed your browser storage, they couldn't retrieve your password.

**Q: What if I forget my password?**
A: Unfortunately, there's no password recovery (by design for security). You would need to create a new profile.

**Q: Can I change my cycle length later?**
A: Yes, but you'll need to enter your password to edit the profile.

## Troubleshooting

**Calendar not loading:**
- Check browser console for errors
- Ensure localStorage is enabled
- Try clearing browser cache

**Password not working:**
- Passwords are case-sensitive
- Ensure Caps Lock is off
- Check for extra spaces

**Session expired:**
- Sessions timeout after 30 minutes
- Simply re-enter your password

## Advanced Usage

### Exporting Data
1. Go to Profile Picker
2. Click on your profile
3. Select "Export Data"
4. Save the JSON file

### Using with Supabase (Cloud Sync)
See README.md for detailed Supabase setup instructions.

## Privacy & Security

- **Local-First**: Data stays on your device
- **Encrypted**: Sensitive fields use AES encryption
- **No Tracking**: No analytics or telemetry
- **No Account Required**: No email, no signup
- **No Server**: Runs entirely in browser (unless you add Supabase)

## Support

This is an educational project. For bugs or feature requests:
1. Check the README.md
2. Review the code in src/
3. Modify as needed (it's your app!)

## Next Steps

1. ✅ Create your profile
2. ✅ Explore the calendar
3. ✅ Read the Learn page (theoretical foundation)
4. ✅ Start daily tracking
5. ✅ Export your data after a few weeks
6. ✅ Analyze patterns in the Insights dashboard

Enjoy using PHASED!
