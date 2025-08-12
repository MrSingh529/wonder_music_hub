
import type { Track, Upcoming } from './types';

// Mock Timestamp for local data
export const Timestamp = {
  now: () => ({
    seconds: Math.floor(Date.now() / 1000),
    nanoseconds: 0,
    toDate: () => new Date(),
  }),
  fromDate: (date: Date) => ({
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0,
    toDate: () => date,
  }),
};


const tracks: Track[] = [
    { 
        id: '1', 
        title: 'Waalian', 
        artist: 'Harpinder Singh', 
        coverUrl: '/covers/IMG_3172.jpg', 
        audioUrl: '/audio/Waalian.mp3',
        releaseDate: Timestamp.fromDate(new Date('2025-08-20')),
        featured: true, 
        published: true, 
        order: 1, 
        blurb: 'A dreamy track for late night drives.',
        lyrics: `(Verse 1)
Waalian teriya jdo khendiya gallan naal,
Asi sochde kaash hunde jagah ohdi asi...
Tere hassde chehre vich lukki ae roshni,
Par asi reh gaye chhup ke ik kone vich khade si...

Dil ch reh geya teri haan da intezaar,
Par tu keh gayi bas dosti da ik pyaar,
Main likhda riha raatan nu teri yaadan ch,
Tu sajdi riha kisey hor de khwaban ch...

Waalian si teriyaan, saah bann ke chaa gyi,
Mere dil de kaagaz te, naam tera likh gyi...
Main reh gya bas vekhda, khushiyan tere naal,
Asi sochde kaash hunde jagah ohdi asi...

Tere bol mere geet ban gaye ne,
Par tuhade laayi oh sirf lafz langh gaye ne,
Main rakhda si teri har gall nu sambh ke,
Tu keh gyi “yaar” keh ke, hass ke...

Chhad gyi tu, par khush rahe jehde naal ae,
Main duawan vich vi tera hi haal ae...
Tu ajj vi roshni ae, bas main hanera ban gaya,
Asi sochde kaash likhe jande kismata’n nava...

Waalian teriya jdo khendiya gallan naal,
Asi sochde kaash hunde jagah ohdi asi...,`,
        createdAt: Timestamp.now(), 
        updatedAt: Timestamp.now() 
    },
    { 
        id: '2', 
        title: 'Efforts > Promises', 
        artist: 'Harpinder Singh', 
        coverUrl: '/covers/Image_2.jpg', 
        audioUrl: '/audio/EffortsPromises.mp3', 
        releaseDate: Timestamp.fromDate(new Date('2025-08-20')),
        featured: false, 
        published: true, 
        order: 2,
        createdAt: Timestamp.now(), 
        updatedAt: Timestamp.now() 
    },
    { 
        id: '3', 
        title: 'Is It Really Love?', 
        artist: 'Harpinder Singh', 
        coverUrl: '/covers/Image_3.jpg', 
        audioUrl: '/audio/IsItReallyLove.mp3', 
        releaseDate: Timestamp.fromDate(new Date('2025-09-13')),
        featured: true, 
        published: true, 
        order: 3, 
        blurb: 'Is It Really Love? by Harpinder Singh',
        createdAt: Timestamp.now(), 
        updatedAt: Timestamp.now() 
    },
    { 
        id: '4', 
        title: 'No One Else', 
        artist: 'Harpinder Singh', 
        coverUrl: '/covers/Image_4.jpg', 
        audioUrl: '/audio/NoOneElse.mp3', 
        releaseDate: Timestamp.fromDate(new Date('2025-09-30')),
        featured: true, 
        published: true, 
        order: 3, 
        blurb: 'No One Else by Harpinder Singh',
        createdAt: Timestamp.now(), 
        updatedAt: Timestamp.now() 
    },
    { 
        id: '5', 
        title: 'Through My Mind', 
        artist: 'Harpinder Singh', 
        coverUrl: '/covers/Image_5.jpg', 
        audioUrl: '/audio/ThroughMyMind.mp3', 
        releaseDate: Timestamp.fromDate(new Date('2025-09-30')),
        featured: true, 
        published: true, 
        order: 3, 
        blurb: 'Through My Mind by Harpinder Singh',
        createdAt: Timestamp.now(), 
        updatedAt: Timestamp.now() 
    },
    { 
        id: '6', 
        title: 'Moon Bound', 
        artist: 'Harpinder Singh', 
        coverUrl: '/covers/Image_6.jpg', 
        audioUrl: '/audio/MoonBound.mp3', 
        releaseDate: Timestamp.fromDate(new Date('2025-09-30')),
        featured: true, 
        published: true, 
        order: 3, 
        blurb: 'Moon Bound by Harpinder Singh',
        createdAt: Timestamp.now(), 
        updatedAt: Timestamp.now() 
    },
    { 
        id: '7', 
        title: "She's Like a Rose", 
        artist: 'Harpinder Singh', 
        coverUrl: '/covers/Image_7.jpg', 
        audioUrl: '/audio/LikeARose.mp3', 
        releaseDate: Timestamp.fromDate(new Date('2025-09-30')),
        featured: true, 
        published: true, 
        order: 3, 
        blurb: "She's Like a Rose by Harpinder Singh",
        createdAt: Timestamp.now(), 
        updatedAt: Timestamp.now() 
    },
    { 
        id: '8', 
        title: "She's Still In Chords", 
        artist: 'Harpinder Singh',
        coverUrl: '/covers/Image_8.jpg', 
        audioUrl: '/audio/StillInChords.mp3', 
        releaseDate: Timestamp.fromDate(new Date('2025-09-30')),
        featured: true, 
        published: true, 
        order: 3, 
        blurb: "She's Still In Chords by Harpinder Singh",
        createdAt: Timestamp.now(), 
        updatedAt: Timestamp.now() 
    },
];

const upcoming: Upcoming[] = [
    { 
        id: '1', 
        title: 'Tere Bin', 
        artist: 'Harpinder Singh', 
        coverUrl: '/covers/terebin.png',
        releaseDate: Timestamp.fromDate(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
        createdAt: Timestamp.now(), 
        updatedAt: Timestamp.now() 
    },
    { 
        id: '2', 
        title: 'Spittin Facts', 
        artist: 'Harpinder Singh', 
        coverUrl: '/covers/facts.png', 
        teaserUrl: '#', 
        releaseDate: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), 
        createdAt: Timestamp.now(), 
        updatedAt: Timestamp.now() 
    },
];

const toPlainObject = <T extends { releaseDate: any; createdAt: any; updatedAt: any; }>(item: T) => {
    return {
        ...item,
        releaseDate: item.releaseDate.toDate(),
        createdAt: item.createdAt.toDate(),
        updatedAt: item.updatedAt.toDate(),
    };
};


export async function getPublishedTracks() {
    return tracks
        .filter(track => track.published)
        .sort((a, b) => {
            if (a.releaseDate.seconds === b.releaseDate.seconds) {
                return a.order - b.order;
            }
            return b.releaseDate.seconds - a.releaseDate.seconds;
        })
        .map(toPlainObject);
}

export async function getFeaturedTracks() {
    return tracks
        .filter(track => track.published && track.featured)
        .sort((a, b) => b.releaseDate.seconds - a.releaseDate.seconds)
        .map(toPlainObject);
}

export async function getUpcomingReleases() {
    return upcoming
        .sort((a, b) => a.releaseDate.seconds - b.releaseDate.seconds)
        .map(toPlainObject);
}

export async function getAllTracks() {
    return tracks.map(toPlainObject);
}
