const Storage = {
    store: (key, value) => localStorage.setItem(key, value),
    get: key => localStorage.getItem(key),
    remove: key => localStorage.removeItem(key),
    storeTokens: (access, refresh) => {
        Storage.store('access_token', access);
        Storage.store('refresh_token', refresh)
    },
    cleanTokens: () => {
        Storage.remove('access_token');
        Storage.remove('refresh_token')
    }
};

export default Storage;
