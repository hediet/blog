import { PageWithRouter, Data } from "@hediet/static-page";

export abstract class BasePage<
    TData extends Data = Data
> extends PageWithRouter<TData> {
    public getHtmlTemplate(): string {
        return `<!DOCTYPE html>
<html>
    <head>
        <title>${this.title}</title>
        <meta charset="utf-8">
        <meta name="theme-color" content="#130f12" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript">
            var _paq = window._paq || [];
            /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
            _paq.push(["trackPageView"]);
            _paq.push(["enableLinkTracking"]);
            (function() {
                var u = "//matom.hediet.de/";
                _paq.push(["setTrackerUrl", u + "matp"]);
                _paq.push(["setSiteId", "1"]);
                var d = document,
                    g = d.createElement("script"),
                    s = d.getElementsByTagName("script")[0];
                g.type = "text/javascript";
                g.async = true;
                g.defer = true;
                g.src = u + "mat.js";
                s.parentNode.insertBefore(g, s);
            })();
        </script>
    </head>
    <body>
        <div id="target"></div>
    </body>
</html>`;
    }
}
