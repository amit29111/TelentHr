/**
 * RN 0.77+ bridgeless mode may not install setImmediate before LogBox runs.
 * Must be imported before react-native in index.js.
 */
if (typeof global.setImmediate !== 'function') {
  let immediateId = 0;
  const pending = new Map();

  global.setImmediate = (callback, ...args) => {
    const id = ++immediateId;
    pending.set(id, true);
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        callback(...args);
      }
    }, 0);
    return id;
  };

  global.clearImmediate = id => {
    pending.delete(id);
  };
}
