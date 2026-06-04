const fs = require("fs");
const path = require("path");
const config = require("../config/env");

const storePath = path.isAbsolute(config.LOCAL_STORE_PATH)
  ? config.LOCAL_STORE_PATH
  : path.resolve(__dirname, "..", config.LOCAL_STORE_PATH);

const defaultStore = {
  users: [],
  predictions: [],
  counters: {
    users: 1,
    predictions: 1,
  },
};

const ensureStore = () => {
  const dir = path.dirname(storePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify(defaultStore, null, 2));
  }
};

const readStore = () => {
  ensureStore();
  return JSON.parse(fs.readFileSync(storePath, "utf8"));
};

const writeStore = (store) => {
  ensureStore();
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
};

const nextId = (store, key) => {
  const id = store.counters[key] || 1;
  store.counters[key] = id + 1;
  return id;
};

const findUserByEmail = async (email) => {
  const store = readStore();
  return store.users.find((user) => user.email === email);
};

const insertUser = async (fullname, email, password) => {
  const store = readStore();
  const user = {
    id: nextId(store, "users"),
    fullname,
    email,
    password,
    created_at: new Date().toISOString(),
  };

  store.users.push(user);
  writeStore(store);
  return user.id;
};

const insertPrediction = async (userId, kwh, month, prediction) => {
  const store = readStore();
  const item = {
    id: nextId(store, "predictions"),
    user_id: userId,
    kwh,
    month,
    prediction,
    created_at: new Date().toISOString(),
  };

  store.predictions.push(item);
  writeStore(store);
  return item.id;
};

const listPredictions = async (userId) => {
  const store = readStore();
  return store.predictions
    .filter((item) => Number(item.user_id) === Number(userId))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const getLatestPrediction = async (userId) => {
  const rows = await listPredictions(userId);
  return rows[0];
};

module.exports = {
  findUserByEmail,
  insertUser,
  insertPrediction,
  listPredictions,
  getLatestPrediction,
};
