export const ok = (message, data, meta) => ({ success: true, message, data, meta });
export const fail = (message) => ({ success: false, message });
