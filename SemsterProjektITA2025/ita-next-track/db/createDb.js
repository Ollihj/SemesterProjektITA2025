import { upload } from 'pg-upload';
import { connect } from './connect.js';

console.log('Recreating database...');
//Git test
const db = await connect();

console.log('Dropping tables...');
await db.query('drop table if exists tracks');
console.log('All tables dropped.');

console.log('Recreating tables...');
await db.query(`
    create table tracks (
        track_id bigint primary key,
        title text not null,
        artist text not null,
        duration int not null,
        energy_level int not null,
        tempo int not null,
        mood text not null,
        is_instrumental boolean not null,
        activity_fit text not null
    )
`);
console.log('Tables recreated.');

console.log('Importing data from CSV files...');
await upload(db, 'db/short-tracks.csv', `
    copy tracks (track_id, title, artist, duration, energy_level, tempo, mood, is_instrumental, activity_fit)
    from stdin
    with csv header`);
console.log('Data imported.');

await db.end();

console.log('Database recreated.');
