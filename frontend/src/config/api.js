const rawApiUrl = import.meta.env.VITE_API_URL || (
    import.meta.env.PROD
        ? "/api"
        : "http://localhost:5000/api"
);

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const getApiBaseUrl = () => {
    const normalized = trimTrailingSlash(rawApiUrl);
    // If it's a relative URL, return it as is (after trimming)
    if (normalized.startsWith("/")) return normalized;
    // For absolute URLs, ensure it ends with /api
    return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
};

