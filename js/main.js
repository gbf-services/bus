const STORAGE_KEY = 'bus_pickup_v1';
function defaultData(){ return { buses: [], students: {} }; }
function loadData(){ try{ const s = localStorage.getItem(STORAGE_KEY); return s? JSON.parse(s): defaultData(); }catch(e){ return defaultData(); } }
function saveData(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

function addOrUpdateBus({name, capacity=10, zones=[]}){
  const data = loadData();
  // find by name
  let bus = data.buses.find(b=>b.name === name);
  if(bus){ bus.capacity = capacity; bus.zones = zones; }
  else { bus = { id: Date.now() + Math.floor(Math.random()*999), name, capacity, zones, students: [] }; data.buses.push(bus); }
  saveData(data); return bus;
}

function findBusForZone(zone){
  const data = loadData();
  // find buses containing zone
  const candidates = data.buses.filter(b=>b.zones.map(z=>z.toLowerCase()).includes(zone.toLowerCase()));
  if(candidates.length === 0) return null;
  // choose least loaded that has capacity
  candidates.sort((a,b) => (a.students.length / a.capacity) - (b.students.length / b.capacity));
  const chosen = candidates.find(b => b.students.length < b.capacity) || candidates[0];
  return chosen;
}

function registerStudent({name, zone}){
  const data = loadData();
  const bus = findBusForZone(zone);
  if(!bus) return null;
  const id = 'ST-'+Math.floor(Math.random()*900000 + 100000);
  data.students[id] = { id, name, zone, busId: bus.id, done: false };
  const b = data.buses.find(x=>x.id === bus.id);
  b.students.push(id);
  saveData(data);
  return { id, name, zone, busId: bus.id, busName: b.name };
}

function markStudentDone(studentId){
  const data = loadData();
  if(!data.students[studentId]) return false;
  data.students[studentId].done = true;
  saveData(data); return true;
}

function addTestData(){
  const data = loadData();
  if(data.buses.length===0){ addOrUpdateBus({name:'Bus 1',capacity:8,zones:['Dbayeh','Zalka']}); addOrUpdateBus({name:'Bus 2',capacity:8,zones:['Jounieh','Kaslik']}); }
}

// run once
addTestData();

// helper for debugging
window.loadData = loadData; window.saveData = saveData; window.addOrUpdateBus = addOrUpdateBus; window.registerStudent = registerStudent; window.markStudentDone = markStudentDone;