import {
    Data,
    Page,
    RouteIndexProvider,
    PlaceholderRouteIndexProvider,
    RouteRef,
    ReactRouter,
    Path
} from "@hediet/static-page";
import ReactDOM = require("react-dom");
import React = require("react");

declare const _paq: any;

export abstract class BasePage<TData extends Data = Data> extends Page<
    TData & { routeIndexProvider?: RouteIndexProvider }
> {
    constructor(data: TData & { routeIndexProvider?: RouteIndexProvider }) {
        if (!data.routeIndexProvider) {
            // this will get replaced when serialized
            data.routeIndexProvider = new PlaceholderRouteIndexProvider();
        }
        super(data);
    }

    public load(selfRef: RouteRef): void {
        const target = document.getElementById("target")!;
        let currentUrl = location.href;
        ReactDOM.render(
            <ReactRouter
                initialPage={this}
                initialRef={selfRef}
                routeIndexProvider={this.data.routeIndexProvider!}
                onNavigated={(newPageRef, newPage) => {
                    _paq.push(["setReferrerUrl", currentUrl]);
                    currentUrl = newPageRef.getUrl();
                    _paq.push(["setCustomUrl", currentUrl]);
                    _paq.push(["setDocumentTitle", newPage.title]);
                    _paq.push(["deleteCustomVariables", "page"]);
                    _paq.push(["setGenerationTimeMs", 0]);
                    _paq.push(["trackPageView"]);
                }}
            />,
            target
        );
    }

    public getHtmlTemplate(path: Path): string {
        const currentUrl = path.toString();
        return `<!DOCTYPE html>
<html>
    <head>
        <title>${this.title}</title>
        <meta charset="utf-8">
        <meta name="theme-color" content="#130f12" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.rss" />
        
        <script type="text/javascript">
        var _paq = window._paq || [];
        /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
        _paq.push(['setCustomUrl', ${JSON.stringify(currentUrl)}]);
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
            var u="//matom.hediet.de/";
            _paq.push(['setTrackerUrl', u+'mat-api']);
            _paq.push(['setSiteId', '3']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'mat-client'; s.parentNode.insertBefore(g,s);
        })();
        </script>
        <noscript><p><img src="//matom.hediet.de/mat-api?idsite=3&amp;rec=1" style="border:0;" alt="" /></p></noscript>
    </head>
    <body>
        <div id="target"></div>
    </body>
</html>`;
    }
}
