
const Config = {
    debug: true,
    info: true,
    error: true,
};

function showLog(isShow, ...msg) {
    if (!isShow) {
        return;
    }

    const t = new Date();
    console.log(t, ...msg);
}

function log(sModule) {
    return {
        config: (cfg) => {
            if (!cfg) {
                return {...Config};
            }
            Object.assign(Config, cfg);
        },
        debug: (...msg) => {
            showLog(Config.debug, sModule, ...msg);
        },
        info: (...msg) => {
            showLog(Config.info, sModule, ...msg);
        },
        error: (...msg) => {
            showLog(Config.error, sModule, ...msg);
        }
    }
}

export default log;
