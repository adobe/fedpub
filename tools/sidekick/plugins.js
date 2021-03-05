(() => {
    const sk = window.hlx && window.hlx.sidekick ? window.hlx.sidekick : window.hlxSidekick;

    if (typeof sk !== 'object') return;

    // PREVIEW
    sk.add({
        id: 'preview',
        override: true,
        condition: (s) => s.isEditor() || s.location.host === s.config.host,
        button: {
            action: () => {
                const { config, location } = sk;
                let url;

                if (sk.isEditor()) {
                    url = new URL('https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@2.7.0');
                    url.search = new URLSearchParams([
                        ['owner', config.owner],
                        ['repo', config.repo],
                        ['ref', config.ref || 'main'],
                        ['path', '/'],
                        ['lookup', location.href],
                    ]).toString();
                } else {
                    const host = location.host === config.innerHost
                        ? config.host : config.innerHost;
                    url = new URL(`https://${host}${location.pathname}`);
                }

                window.open(url.toString(), `hlx-sk-preview-${window.btoa(location.href)}`);
            },
        },
    });

    // TAGGER
    sk.add({
        id: 'tagger',
        condition: (sidekick) => sidekick.isEditor() && (sidekick.location.search.includes('.docx&') || sidekick.location.search.includes('.md&')),
        button: {
            text: 'Tagger',
            action: () => {
                const { config } = sk;
                window.open(`https://${config.innerHost}/tools/tagger/`, 'hlx-sidekick-tagger');
            },
        },
    });
})();
