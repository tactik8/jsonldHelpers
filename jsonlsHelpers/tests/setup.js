
// Mock window.crypto for testing environment
if (typeof window === 'undefined') {
  global.window = {};
}

if (!window.crypto) {
  window.crypto = {
    getRandomValues: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }
  };
}

// Mock functions that might be missing from the imports
global.getValues = function(obj, key, defaultValue = []) {
  const value = obj?.[key];
  return value !== undefined ? (Array.isArray(value) ? value : [value]) : defaultValue;
};

global.addValue = function(obj, key, value, unique = false) {
  if (!obj[key]) {
    obj[key] = [];
  }
  if (!Array.isArray(obj[key])) {
    obj[key] = [obj[key]];
  }
  
  if (Array.isArray(value)) {
    value.forEach(v => {
      if (!unique || !obj[key].includes(v)) {
        obj[key].push(v);
      }
    });
  } else {
    if (!unique || !obj[key].includes(value)) {
      obj[key].push(value);
    }
  }
  
  if (obj[key].length === 1) {
    obj[key] = obj[key][0];
  }
};

global.getValue = function(obj, key, defaultValue) {
  return obj?.[key] !== undefined ? obj[key] : defaultValue;
};

global.getRecord = function(ref, records) {
  if (!ref || !records) return undefined;
  return records.find(record => 
    record?.['@type'] === ref?.['@type'] && 
    record?.['@id'] === ref?.['@id']
  );
};

global.addRecord = function(record, records, unique = false) {
  if (!Array.isArray(records)) return;
  
  if (unique) {
    const exists = records.some(r => 
      r?.['@type'] === record?.['@type'] && 
      r?.['@id'] === record?.['@id']
    );
    if (!exists) {
      records.push(record);
    }
  } else {
    records.push(record);
  }
};

global.deleteValue = function(obj, key, value) {
  if (!obj[key]) return;
  
  if (Array.isArray(obj[key])) {
    obj[key] = obj[key].filter(v => !global.isSame(v, value));
    if (obj[key].length === 0) {
      delete obj[key];
    } else if (obj[key].length === 1) {
      obj[key] = obj[key][0];
    }
  } else if (global.isSame(obj[key], value)) {
    delete obj[key];
  }
};

// Helper function for isSame comparison
global.isSame = function(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;
  if (typeof a === 'object') {
    if (a['@type'] && a['@id'] && b['@type'] && b['@id']) {
      return a['@type'] === b['@type'] && a['@id'] === b['@id'];
    }
  }
  return a === b;
};
