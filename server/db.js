require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// ── Default seed data
const DEFAULT_CROPS = [
  { id:1,  name:'Maize',       emoji:'🌽', season:'Mar–Jun, Oct–Dec', ph_range:'5.5–7.0', water_needs:'500–800mm',   days_to_harvest:'90–120',  description:'Main staple food. Grows well in Kisii highlands at 1500-2000m.' },
  { id:2,  name:'Beans',       emoji:'🫘', season:'Mar–May, Oct–Nov', ph_range:'6.0–7.0', water_needs:'300–500mm',   days_to_harvest:'60–90',   description:'Important protein source and good nitrogen fixer for soil.' },
  { id:3,  name:'Tomatoes',    emoji:'🍅', season:'Year-round',       ph_range:'6.0–6.8', water_needs:'400–600mm',   days_to_harvest:'70–90',   description:'High-value cash crop. Needs staking and regular monitoring.' },
  { id:4,  name:'Kale/Sukuma', emoji:'🥬', season:'Year-round',       ph_range:'6.0–7.5', water_needs:'250–400mm',   days_to_harvest:'45–60',   description:'Fast-growing leafy vegetable. High demand in local markets.' },
  { id:5,  name:'Potatoes',    emoji:'🥔', season:'Mar–May, Sep–Nov', ph_range:'4.8–5.5', water_needs:'500–700mm',   days_to_harvest:'90–120',  description:'Important food security crop. Grows well in highland areas.' },
  { id:6,  name:'Avocado',     emoji:'🥑', season:'Feb–May',          ph_range:'6.0–7.0', water_needs:'1000–1200mm', days_to_harvest:'180–210', description:'High-value export crop. Hass variety fetches premium prices.' },
  { id:7,  name:'Sweet Potato',emoji:'🍠', season:'Year-round',       ph_range:'5.5–6.5', water_needs:'300–500mm',   days_to_harvest:'90–150',  description:'Drought-tolerant and nutritious. Good for food security.' },
  { id:8,  name:'Sorghum',     emoji:'🌾', season:'Mar–May',          ph_range:'5.5–7.5', water_needs:'250–450mm',   days_to_harvest:'100–130', description:'Drought-resistant. Good for food security in dry areas.' },
  { id:9,  name:'Cabbage',     emoji:'🥦', season:'Mar–Jun, Sep–Dec', ph_range:'6.0–7.5', water_needs:'380–500mm',   days_to_harvest:'70–120',  description:'Popular vegetable with good market demand year-round.' },
  { id:10, name:'Cassava',     emoji:'🌿', season:'Mar–Apr',          ph_range:'5.5–6.5', water_needs:'150–600mm',   days_to_harvest:'270–365', description:'Highly drought-tolerant staple. Long storage when left in ground.' },
];

const DEFAULT_MARKET = [
  { id:1, crop_name:'Maize',        unit:'per 90kg bag',    price:4500,  change_percent:5.2,   demand:'High'   },
  { id:2, crop_name:'Beans',        unit:'per 90kg bag',    price:10800, change_percent:-2.1,  demand:'Medium' },
  { id:3, crop_name:'Tomatoes',     unit:'per crate (30kg)',price:2400,  change_percent:12.4,  demand:'High'   },
  { id:4, crop_name:'Kale/Sukuma',  unit:'per bunch',       price:15,    change_percent:1.8,   demand:'High'   },
  { id:5, crop_name:'Potatoes',     unit:'per 50kg bag',    price:1800,  change_percent:-8.3,  demand:'Medium' },
  { id:6, crop_name:'Avocado',      unit:'per tray (60)',   price:1200,  change_percent:22.0,  demand:'High'   },
  { id:7, crop_name:'Sweet Potato', unit:'per 50kg bag',    price:1200,  change_percent:3.5,   demand:'High'   },
  { id:8, crop_name:'Cabbage',      unit:'per head',        price:50,    change_percent:-5.0,  demand:'Medium' },
];

// ── In-memory store (used when no DATABASE_URL)
const store = {
  crops:        JSON.parse(JSON.stringify(DEFAULT_CROPS)),
  market:       JSON.parse(JSON.stringify(DEFAULT_MARKET)),
  queries:      [],
  messages:     [],
  adminHash:    null,
  nextId:       { crops: 11, market: 9, queries: 1, messages: 1 }
};

// ── PostgreSQL pool
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : null;

async function pq(sql, params = []) {
  const client = await pool.connect();
  try { return await client.query(sql, params); }
  finally { client.release(); }
}

// ── Database operations
const db = {

  // CROPS
  async getCrops() {
    if (pool) {
      const r = await pq('SELECT * FROM crops ORDER BY name');
      return r.rows;
    }
    return store.crops;
  },
  async getCropById(id) {
    if (pool) {
      const r = await pq('SELECT * FROM crops WHERE id=$1', [id]);
      return r.rows[0];
    }
    return store.crops.find(c => c.id === parseInt(id));
  },
  async createCrop(data) {
    if (pool) {
      const r = await pq(
        'INSERT INTO crops (name,emoji,season,ph_range,water_needs,days_to_harvest,description) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        [data.name, data.emoji, data.season, data.ph_range, data.water_needs, data.days_to_harvest, data.description]
      );
      return r.rows[0];
    }
    const crop = { id: store.nextId.crops++, ...data };
    store.crops.push(crop);
    return crop;
  },
  async updateCrop(id, data) {
    if (pool) {
      const r = await pq(
        'UPDATE crops SET name=$1,emoji=$2,season=$3,ph_range=$4,water_needs=$5,days_to_harvest=$6,description=$7,updated_at=NOW() WHERE id=$8 RETURNING *',
        [data.name, data.emoji, data.season, data.ph_range, data.water_needs, data.days_to_harvest, data.description, id]
      );
      return r.rows[0];
    }
    const i = store.crops.findIndex(c => c.id === parseInt(id));
    if (i === -1) return null;
    store.crops[i] = { ...store.crops[i], ...data };
    return store.crops[i];
  },
  async deleteCrop(id) {
    if (pool) {
      await pq('DELETE FROM crops WHERE id=$1', [id]);
      return true;
    }
    const i = store.crops.findIndex(c => c.id === parseInt(id));
    if (i !== -1) store.crops.splice(i, 1);
    return true;
  },

  // MARKET
  async getMarket() {
    if (pool) {
      const r = await pq('SELECT * FROM market_prices ORDER BY crop_name');
      return r.rows;
    }
    return store.market;
  },
  async createMarket(data) {
    if (pool) {
      const r = await pq(
        'INSERT INTO market_prices (crop_name,unit,price,change_percent,demand) VALUES($1,$2,$3,$4,$5) RETURNING *',
        [data.crop_name, data.unit, data.price, data.change_percent, data.demand]
      );
      return r.rows[0];
    }
    const item = { id: store.nextId.market++, ...data };
    store.market.push(item);
    return item;
  },
  async updateMarket(id, data) {
    if (pool) {
      const r = await pq(
        'UPDATE market_prices SET crop_name=$1,unit=$2,price=$3,change_percent=$4,demand=$5,updated_at=NOW() WHERE id=$6 RETURNING *',
        [data.crop_name, data.unit, data.price, data.change_percent, data.demand, id]
      );
      return r.rows[0];
    }
    const i = store.market.findIndex(m => m.id === parseInt(id));
    if (i === -1) return null;
    store.market[i] = { ...store.market[i], ...data };
    return store.market[i];
  },
  async deleteMarket(id) {
    if (pool) { await pq('DELETE FROM market_prices WHERE id=$1', [id]); return true; }
    const i = store.market.findIndex(m => m.id === parseInt(id));
    if (i !== -1) store.market.splice(i, 1);
    return true;
  },

  // QUERIES
  async logQuery(query_type, user_query, ai_response) {
    const entry = { id: store.nextId.queries++, query_type, user_query: user_query.substring(0, 500), ai_response: ai_response.substring(0, 1000), created_at: new Date() };
    if (pool) {
      await pq('INSERT INTO ai_queries (query_type,user_query,ai_response) VALUES($1,$2,$3)', [query_type, entry.user_query, entry.ai_response]);
      return;
    }
    store.queries.unshift(entry);
    if (store.queries.length > 500) store.queries.pop();
  },
  async getQueries(limit = 100) {
    if (pool) {
      const r = await pq('SELECT * FROM ai_queries ORDER BY created_at DESC LIMIT $1', [limit]);
      return r.rows;
    }
    return store.queries.slice(0, limit);
  },

  // MESSAGES
  async getMessages() {
    if (pool) {
      const r = await pq('SELECT * FROM farmer_messages ORDER BY created_at DESC');
      return r.rows;
    }
    return store.messages;
  },
  async createMessage(data) {
    if (pool) {
      const r = await pq(
        'INSERT INTO farmer_messages (name,phone,message) VALUES($1,$2,$3) RETURNING *',
        [data.name, data.phone, data.message]
      );
      return r.rows[0];
    }
    const msg = { id: store.nextId.messages++, status: 'unread', created_at: new Date(), ...data };
    store.messages.unshift(msg);
    return msg;
  },
  async updateMessage(id, status) {
    if (pool) {
      const r = await pq('UPDATE farmer_messages SET status=$1 WHERE id=$2 RETURNING *', [status, id]);
      return r.rows[0];
    }
    const i = store.messages.findIndex(m => m.id === parseInt(id));
    if (i !== -1) store.messages[i].status = status;
    return store.messages[i];
  },

  // ADMIN AUTH
  async getAdminHash() {
    if (store.adminHash) return store.adminHash;
    const pw = process.env.ADMIN_PASSWORD || 'shamba2024';
    store.adminHash = bcrypt.hashSync(pw, 10);
    return store.adminHash;
  },
  async getAdminUsername() {
    return process.env.ADMIN_USERNAME || 'admin';
  },

  // STATS
  async getStats() {
    if (pool) {
      const [crops, market, queries, messages] = await Promise.all([
        pq('SELECT COUNT(*) FROM crops'),
        pq('SELECT COUNT(*) FROM market_prices'),
        pq('SELECT COUNT(*) FROM ai_queries'),
        pq("SELECT COUNT(*) FROM farmer_messages WHERE status='unread'"),
      ]);
      return {
        crops: parseInt(crops.rows[0].count),
        market: parseInt(market.rows[0].count),
        queries: parseInt(queries.rows[0].count),
        unread: parseInt(messages.rows[0].count),
      };
    }
    return {
      crops:   store.crops.length,
      market:  store.market.length,
      queries: store.queries.length,
      unread:  store.messages.filter(m => m.status === 'unread').length,
    };
  },

  // INIT
  async init() {
    if (!pool) {
      console.log('⚡ Running with in-memory data (no DATABASE_URL set)');
      return;
    }
    console.log('🗄️  Connecting to PostgreSQL...');
    await pq(`
      CREATE TABLE IF NOT EXISTS crops (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        emoji VARCHAR(10),
        season VARCHAR(200),
        ph_range VARCHAR(50),
        water_needs VARCHAR(100),
        days_to_harvest VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pq(`
      CREATE TABLE IF NOT EXISTS market_prices (
        id SERIAL PRIMARY KEY,
        crop_name VARCHAR(100) NOT NULL,
        unit VARCHAR(100),
        price INTEGER NOT NULL,
        change_percent DECIMAL(5,2) DEFAULT 0,
        demand VARCHAR(20) DEFAULT 'Medium',
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pq(`
      CREATE TABLE IF NOT EXISTS ai_queries (
        id SERIAL PRIMARY KEY,
        query_type VARCHAR(50),
        user_query TEXT,
        ai_response TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pq(`
      CREATE TABLE IF NOT EXISTS farmer_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        phone VARCHAR(20),
        message TEXT,
        status VARCHAR(20) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Seed crops if empty
    const { rows: existingCrops } = await pq('SELECT COUNT(*) FROM crops');
    if (parseInt(existingCrops[0].count) === 0) {
      for (const c of DEFAULT_CROPS) {
        await pq(
          'INSERT INTO crops (name,emoji,season,ph_range,water_needs,days_to_harvest,description) VALUES($1,$2,$3,$4,$5,$6,$7)',
          [c.name, c.emoji, c.season, c.ph_range, c.water_needs, c.days_to_harvest, c.description]
        );
      }
      console.log('  ✓ Seeded crops');
    }

    // Seed market if empty
    const { rows: existingMarket } = await pq('SELECT COUNT(*) FROM market_prices');
    if (parseInt(existingMarket[0].count) === 0) {
      for (const m of DEFAULT_MARKET) {
        await pq(
          'INSERT INTO market_prices (crop_name,unit,price,change_percent,demand) VALUES($1,$2,$3,$4,$5)',
          [m.crop_name, m.unit, m.price, m.change_percent, m.demand]
        );
      }
      console.log('  ✓ Seeded market prices');
    }

    console.log('  ✅ Database ready');
  }
};

module.exports = db;
module.exports.initDB = db.init.bind(db);
