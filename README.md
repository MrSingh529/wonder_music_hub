
# Harmony Hub

This is a Next.js starter for a label-owned music site, built with Firebase Studio.

## Project Overview

Harmony Hub is a production-ready prototype for a music label's official website. It features a public-facing site for listeners to stream music. All music and artwork are hosted locally within the `public` folder.

### Public Features
- **Home Page**: An interactive music player with a playlist of all published tracks.
- **Featured Page**: A gallery of curated, featured tracks.
- **Coming Soon Page**: A list of upcoming releases.
- **Sticky Mini-Player**: Continuous music playback across all public pages.
- **Dynamic Artwork**: Deterministic gradients for tracks without cover art.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

## Setup and Installation

Follow these steps to get your local development environment set up.

### 1. Add Your Music & Artwork

1.  **Add Audio Files**: Place your `.mp3` files inside the `public/audio/` directory.
2.  **Add Cover Art**: Place your cover images (e.g., `.png`, `.jpg`) inside the `public/covers/` directory.

### 2. Update the Local Data Source

All site content is managed from a single file: `src/lib/data.ts`.

1.  **Open `src/lib/data.ts`**: This file contains arrays for `tracks` and `upcoming` releases.
2.  **Edit the `tracks` array**: To add a new song, create a new object in the `tracks` array. Make sure to update the `coverUrl` and `audioUrl` to point to the correct paths in the `public` directory (e.g., `/covers/your-cover.png`).
3.  **Edit the `upcoming` array**: To announce a new release, add an object to the `upcoming` array.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

## Deployment

You can deploy this application to any static hosting provider or a platform with Next.js support like Vercel or Firebase Hosting.

To deploy your application to Firebase Hosting:

```bash
firebase deploy --only hosting
```
