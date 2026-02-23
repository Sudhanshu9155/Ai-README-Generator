const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const getApiBaseUrl = () => {
    const normalized = trimTrailingSlash(rawApiUrl);
    return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
};

