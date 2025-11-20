# Bicycle Benefits Madison

A mobile-first PWA for finding bicycle-friendly businesses in Madison, WI that offer discounts to cyclists. Built in an hour for a hackathon, lol. Find it at https://bb.samnesler.com

<img width="645" height="1398" alt="image" src="https://github.com/user-attachments/assets/46c05a6b-3c18-4b58-9cfa-9397e11dc98a" />

## Features

- **Interactive Map** - Dark-themed Mapbox map with business markers
- **Live Location** - Shows your current position and businesses sorted by distance
- **Bike Routing** - Red cycling route from your location to selected businesses
- **Category Filtering** - Filter businesses by type (restaurants, shops, etc.)
- **Bike Time Estimates** - Shows estimated cycling time to each business
- **AI Assistant** - Claude-powered chatbot to help find businesses
- **PWA Support** - Add to home screen for app-like experience

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4
- **Maps**: Mapbox GL JS, react-map-gl
- **Backend**: Cloudflare Workers
- **AI**: Claude API (Haiku)

## Future work

- there's no reason it couldn't be expanded beyond Madison except that we didn't have time
- better icons
- probably remove the AI chatbot

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create `.env` file with your Mapbox token:
   ```
   VITE_MAPBOX_TOKEN=your_mapbox_token
   ```

3. Run development server:
   ```bash
   pnpm dev
   ```

## Deployment

1. Build the app:
   ```bash
   pnpm build
   ```

2. Add Anthropic API key as secret:
   ```bash
   pnpm wrangler secret put ANTHROPIC_API_KEY
   ```

3. Deploy to Cloudflare:
   ```bash
   pnpm wrangler deploy
   ```

## API

Uses the Bicycle Benefits API to fetch participating businesses in Madison:
```
https://bicyclebenefits.org/members?city_id=6
```
