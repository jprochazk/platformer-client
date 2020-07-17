


const DEFAULTS = {
    debug: true,
    bindings: {
        move: {
            up: "w",
            down: "s",
            left: "a",
            right: "d"
        }
    }
};

const CONFIG_LOCALSTORAGE_KEY = "gc";

const isStorageAvailable = (e: 'localStorage' | 'sessionStorage') => {
    let t;
    try {
        t = window[e];
        const r = "__storage_test__";
        return t.setItem(r, r), t.removeItem(r), !0
    } catch (e) {
        return e instanceof DOMException && (22 === e.code || 1014 === e.code || "QuotaExceededError" === e.name || "NS_ERROR_DOM_QUOTA_REACHED" === e.name) && t && 0 !== t.length
    }
};

function loadConfig() {
    if (!isStorageAvailable('localStorage')) {
        throw new Error(`Unable to load configuration`);
    }

    if (!localStorage.getItem(CONFIG_LOCALSTORAGE_KEY)) {
        localStorage.setItem(CONFIG_LOCALSTORAGE_KEY, JSON.stringify(DEFAULTS));
    }

    return JSON.parse(localStorage.getItem(CONFIG_LOCALSTORAGE_KEY)!);
}

let config = loadConfig();
window.addEventListener("beforeunload", () => {
    localStorage.setItem(CONFIG_LOCALSTORAGE_KEY, JSON.stringify(config));
});

export class Config {
    private constructor() { }

    public static get(key: string): any {
        const keys = key.split(".");
        if (keys.length > 1) {
            let obj = config[keys.shift()!];
            for (const key of keys) {
                obj = obj[key];
            }
            return obj;
        } else {
            return config[key] ?? null;
        }
    }

    public static set(key: string, value: any) {
        config[key] = value;
    }

    public static reset() {
        config = DEFAULTS;
    }
}

if (Config.get("debug")) {
    //@ts-ignore
    window.Config = Config;
}