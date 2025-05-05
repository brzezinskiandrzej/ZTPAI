import request    from 'supertest';
import { AppDataSource } from '../src/database/config/data-source';
import app        from '../src/main';           // eksportujesz Express‑a z main.ts

beforeAll(async () => {
  // 1) łączymy się z bazą w schemacie "test"
  await AppDataSource.initialize();
  // 2) wsiewamy minimalne dane (możesz zrobić insert lub zaimportować seedery)
  await AppDataSource.query(`
    INSERT INTO users (user_id, username, email, password_hash)
    VALUES (1, 'tester', 't@x.com', 'hash')
    ON CONFLICT DO NOTHING;
  `);
});

afterAll(async () => {
  // sprzątanie – schemat testowy zostanie automatycznie usunięty
  await AppDataSource.destroy();
});

describe('GET /api/playlist/:userId', () => {
  it('zwraca playlistę dla istniejącego usera', async () => {
    const res = await request(app).get('/api/playlist/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('username', 'tester');
    expect(res.body).toHaveProperty('tracks');
    expect(Array.isArray(res.body.tracks)).toBe(true);
  });

  it('404 dla nieistniejącego usera', async () => {
    const res = await request(app).get('/api/playlist/999');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/tracks/:id/play', () => {
  it('inkrementuje licznik odsłuchań', async () => {
    // wrzuć sztuczny utwór
    await AppDataSource.query(`
      INSERT INTO songs (song_id, title, play_count)
      VALUES (1, 'Demo', 0) ON CONFLICT DO NOTHING;
    `);

    const res = await request(app).post('/api/tracks/1/play');
    expect(res.status).toBe(200);
    expect(res.body.playCount).toBe(1);
  });
});
