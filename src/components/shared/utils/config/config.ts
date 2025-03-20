import { LocalStorageConstants, LocalStorageUtils, URLUtils } from '@deriv-com/utils';
import { isStaging } from '../url/helpers';

export const APP_IDS = {
    LOCALHOST: 36300,
    TMP_STAGING: 64584,
    STAGING: 29934,
    STAGING_BE: 29934,
    STAGING_ME: 29934,
    PRODUCTION: 65555,
    PRODUCTION_BE: 65556,
    PRODUCTION_ME: 65557,
};

export const livechat_license_id = 12049137;
export const livechat_client_id = '66aa088aad5a414484c1fd1fa8a5ace7';

export const domain_app_ids = {
    'master.bot-standalone.pages.dev': APP_IDS.TMP_STAGING,
    'staging-dbot.deriv.com': APP_IDS.STAGING,
    'staging-dbot.deriv.be': APP_IDS.STAGING_BE,
    'staging-dbot.deriv.me': APP_IDS.STAGING_ME,
    'dbot.deriv.com': APP_IDS.PRODUCTION,
    'dbot.deriv.be': APP_IDS.PRODUCTION_BE,
    'dbot.deriv.me': APP_IDS.PRODUCTION_ME,
};

export const getCurrentProductionDomain = () =>
    !/^staging\./.test(window.location.hostname) &&
    Object.keys(domain_app_ids).find(domain => window.location.hostname === domain);

export const isProduction = () => {
    const all_domains = Object.keys(domain_app_ids).map(domain => `(www\\.)?${domain.replace('.', '\\.')}`);
    return new RegExp(`^(${all_domains.join('|')})$`, 'i').test(window.location.hostname);
};

export const isTestLink = () => {
    return (
        window.location.origin?.includes('.binary.sx') ||
        window.location.origin?.includes('bot-65f.pages.dev') ||
        isLocal()
    );
};

export const isLocal = () => /localhost(:\d+)?$/i.test(window.location.hostname);

const getDefaultServerURL = () => {
    if (isTestLink()) {
        return 'ws.derivws.com';
    }

    let active_loginid_from_url;
    const search = window.location.search;
    if (search) {
        const params = new URLSearchParams(document.location.search.substring(1));
        active_loginid_from_url = params.get('acct1');
    }

    const loginid = window.localStorage.getItem('active_loginid') ?? active_loginid_from_url;
    const is_real = loginid && !/^(VRT|VRW)/.test(loginid);

    const server = is_real ? 'green' : 'blue';
    const server_url = `${server}.derivws.com`;

    return server_url;
};

export const getSocketURL = () => {
    const local_storage_server_url = window.localStorage.getItem('config.server_url');
    const valid_server_urls = ['green.derivws.com', 'blue.derivws.com', 'red.derivws.com'];

    const server_url =
        local_storage_server_url && valid_server_urls.includes(local_storage_server_url)
            ? `wss://${local_storage_server_url}/websockets/v3?app_id=70086`
            : `wss://blue.derivws.com/websockets/v3?app_id=70086`;

    console.log("🛰️ WebSocket URL:", server_url); // Debugging log
    return server_url;
};

export const testWebSocketConnection = () => {
    const ws_url = getSocketURL();
    const testSocket = new WebSocket(ws_url);

    testSocket.onopen = () => console.log("✅ WebSocket Connected!");
    testSocket.onerror = (error) => console.error("❌ WebSocket Error:", error);
    testSocket.onclose = () => console.warn("⚠️ WebSocket Disconnected.");
};

testWebSocketConnection(); // Call the test function
