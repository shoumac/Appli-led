(function(){
  const KEYS_PREFIX = 'led3_';
  let timer = null;
  let syncing = false;
  let queued = false;

  function client(){
    if(!window.supabase || !window.LED3_SUPABASE_URL || !window.LED3_SUPABASE_PUBLISHABLE_KEY) return null;
    return window.led3Supabase || (window.led3Supabase = window.supabase.createClient(window.LED3_SUPABASE_URL, window.LED3_SUPABASE_PUBLISHABLE_KEY));
  }

  // Collect all LED3 data keys. Keep progression for the legacy home-page meter.
  function snapshot(){
    const payload = {};
    for(let i=0; i<localStorage.length; i++){
      const key = localStorage.key(i);
      if(!key) continue;
      if(key.startsWith(KEYS_PREFIX) || key === 'progression'){
        const raw = localStorage.getItem(key);
        try { payload[key] = JSON.parse(raw); }
        catch(_){ payload[key] = raw; }
      }
    }
    return payload;
  }

  async function sync(){
    if(syncing){ queued = true; return; }
    const c = client();
    if(!c) return;
    syncing = true;
    const el = document.getElementById('led3-cloud-status');
    try {
      const {data: authData, error: authError} = await c.auth.getSession();
      if(authError) throw authError;
      const session = authData && authData.session;
      if(!session){ if(el) el.textContent = '☁️ Connecte-toi pour synchroniser'; return; }
      const payload = snapshot();
      if(Object.keys(payload).length === 0){
        if(el) el.textContent = '⚠️ Connecté, mais aucune donnée LED3 trouvée sur cet appareil';
        console.warn('[LED3 sync] Aucun élément led3_ ou progression dans localStorage.');
        return;
      }
      const {error} = await c.from('student_snapshots').upsert({
        student_id: session.user.id,
        payload,
        updated_at: new Date().toISOString()
      }, {onConflict:'student_id'});
      if(error) throw error;
      if(el) el.textContent = '☁️ Résultats synchronisés (' + Object.keys(payload).length + ' éléments)';
    } catch(error) {
      if(el) el.textContent = '⚠️ Synchronisation échouée : ' + (error.message || 'erreur inconnue');
      console.error('[LED3 sync]', error);
    } finally {
      syncing = false;
      if(queued){ queued = false; setTimeout(sync, 100); }
    }
  }

  function scheduleSync(){ clearTimeout(timer); timer = setTimeout(sync, 500); }
  function install(){
    const c = client();
    if(!c) return;
    // Hook writes made by the app after this script is loaded.
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value){
      originalSetItem.call(this, key, value);
      if(key && (key.startsWith(KEYS_PREFIX) || key === 'progression')) scheduleSync();
    };
    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function(key){
      originalRemoveItem.call(this, key);
      if(key && (key.startsWith(KEYS_PREFIX) || key === 'progression')) scheduleSync();
    };
    c.auth.onAuthStateChange(() => setTimeout(sync, 250));
    window.addEventListener('pageshow', scheduleSync);
    window.addEventListener('pagehide', sync);
    window.addEventListener('storage', event => {
      if(event.key && (event.key.startsWith(KEYS_PREFIX) || event.key === 'progression')) scheduleSync();
    });
    window.led3SyncNow = sync;
    setTimeout(sync, 300);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
