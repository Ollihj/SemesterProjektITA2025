import express from 'express';
import path from 'path';
import { connect } from '../db/connect.js';
import { play } from './player.js';

const db = await connect();
const tracks = await loadTracks();
const currentTracks = new Map(); // maps userSession to track info

const port = process.env.PORT || 3003;
const server = express();

server.use(express.static('frontend'));
server.use(express.json());
server.use(onEachRequest);
server.get('/api/track/:activity', onGetTrackForActivity);
server.get('/api/track/:activity/:timeOfDay', onGetTrackForActivityAndTime);
server.get(/\/[a-zA-Z0-9-_/]+/, onFallback);
server.listen(port, onServerReady);

// Hent track baseret på aktivitet (bruger automatisk tidspunkt)
async function onGetTrackForActivity(request, response) {
    const activity = request.params.activity;
    const timeOfDay = getTimeOfDay();
    const track = pickBestTrack(activity, timeOfDay);
    response.json({
        track,
        activity,
        timeOfDay,
        score: track.score
    });
}

// Hent track baseret på aktivitet og specifikt tidspunkt
async function onGetTrackForActivityAndTime(request, response) {
    const activity = request.params.activity;
    const timeOfDay = request.params.timeOfDay;
    const track = pickBestTrack(activity, timeOfDay);
    response.json({
        track,
        activity,
        timeOfDay,
        score: track.score
    });
}

function onEachRequest(request, response, next) {
    console.log(new Date(), request.method, request.url);
    next();
}

async function onFallback(request, response) {
    response.sendFile(path.join(import.meta.dirname, '..', 'frontend', 'index.html'));
}

function onServerReady() {
    console.log('Webserver running on port', port);
}

async function loadTracks() {
    const dbResult = await db.query(`
        select track_id, title, artist, duration, energy_level, tempo, mood, is_instrumental, activity_fit
        from   tracks
    `);
    return dbResult.rows;
}

function getTimeOfDay() {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
        return 'morning';      // 6-12
    } else if (hour >= 12 && hour < 18) {
        return 'afternoon';    // 12-18
    } else if (hour >= 18 && hour < 23) {
        return 'evening';      // 18-23
    } else {
        return 'night';        // 23-6
    }
}

function calculateScore(track, activity, timeOfDay) {
    let score = 0;
   
    // 1. AKTIVITET MATCH (højest vægt - 40 points max)
    
    if (track.activity_fit && track.activity_fit.includes(activity)) {
        score += 40;  // Perfect match!
        
        // Bonus points for specifik aktivitet match
        if (activity === 'gym' && track.energy_level >= 8) {
            score += 10;  // Extra for høj energy på gym
        }
        
        if (activity === 'study' && track.is_instrumental) {
            score += 10;  // Extra for instrumental ved study
        }
        
        if (activity === 'party' && track.tempo > 130) {
            score += 10;  // Extra for høj BPM ved party
        }
        
        if (activity === 'running' && track.tempo > 140) {
            score += 10;  // Extra for høj tempo ved running
        }
    } else {
        // Ikke et match - trøste præmie 
        score += 5;
    }
    
    // 2. TIDSPUNKT MATCH (medium vægt - 30 points max)

    if (timeOfDay === 'morning') {
        // Morgen: Medium energy, happy mood
        if (track.energy_level >= 5 && track.energy_level <= 7) {
            score += 15;
        }
        if (track.mood === 'happy' || track.mood === 'energetic') {
            score += 10;
        }
        // Straf for alt for lav energy
        if (track.energy_level < 3) {
            score -= 10;
        }
    }
    else if (timeOfDay === 'afternoon') {
        // Eftermiddag: Varieret, alt fungerer
        score += 10;
    }
    else if (timeOfDay === 'evening') {
        // Aften: Høj energy, fest-vibes
        if (track.energy_level >= 7) {
            score += 20;
        }
        if (track.tempo > 130) {
            score += 10;
        }
    }
    else if (timeOfDay === 'night') {
        // Nat: Lav energy, chill vibes
        if (track.energy_level <= 4) {
            score += 20;
        }
        if (track.mood === 'calm') {
            score += 10;
        }
        // Straf for høj energy om natten (med mindre party!)
        if (track.energy_level > 7 && activity !== 'party') {
            score -= 15;
        }
    }
    
    // 3. TEMPO MATCH (lav vægt - 20 points max)
    
    if (activity === 'gym' || activity === 'running') {
        // Høj tempo for motion
        if (track.tempo > 140) {
            score += 15;
        } else if (track.tempo > 120) {
            score += 8;
        }
    }
    
    if (activity === 'study' || activity === 'cafe') {
        // Lav til moderat tempo for koncentration
        if (track.tempo < 110) {
            score += 15;
        } else if (track.tempo < 130) {
            score += 8;
        }
    }
    
    // 4. MOOD MATCH (lav vægt - 15 points max)
    
    const activityMoodMap = {
        'gym': ['energetic', 'happy'],
        'party': ['energetic', 'happy'],
        'study': ['calm'],
        'cafe': ['calm', 'happy'],
        'running': ['energetic'],
        'home': ['calm', 'happy']
    };
    
    const preferredMoods = activityMoodMap[activity] || [];
    if (preferredMoods.includes(track.mood)) {
        score += 15;
    }
    
    return score;
}

function pickBestTrack(activity, timeOfDay) {
    // Beregn score for alle tracks
    const scoredTracks = tracks.map(track => ({
        ...track,
        score: calculateScore(track, activity, timeOfDay)
    }));
    
    // Sorter efter score (højest først)
    scoredTracks.sort((a, b) => b.score - a.score);
    
    // Returner det bedste track
    return scoredTracks[0];
}