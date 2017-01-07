import { VNode, div, h2, svg, a, img } from '@cycle/dom';
import { DOMSource } from '@cycle/dom/xstream-typings';
import throttle from 'xstream/extra/throttle';
import xs, { Stream } from 'xstream';
import { Styles, setupApplicationBaseStyles } from './app.styles';
import { normalize, setupPage } from 'csstips';
import { scaleLinear } from 'd3-scale';

import { Pythagoras } from './pythagoras';
import { Throttle } from './throttle';

normalize();
setupPage('#app');
setupApplicationBaseStyles();

export type Sources = {
    DOM: DOMSource;
}

export type Sinks = {
    DOM: Stream<VNode>;
}

const svgDimensions = {
    width: 1280,
    height: 600
}

const realMax = 11;

export function App(sources: Sources): Sinks {
    const scaleFactor = scaleLinear().domain([svgDimensions.height, 0]).range([0, .8]);
    const scaleLean = scaleLinear().domain([0, svgDimensions.width / 2, svgDimensions.width]).range([.5, 0, -.5]);

    const throttleSinks = Throttle(sources);

    const mouseEvent$ = sources.DOM.select('#the-svg').events('mousemove');

    const throttledMouseEvent$ = throttleSinks.throttle
        .map(v => throttle(v)(mouseEvent$)).flatten();

    const factorAndLean$ = throttledMouseEvent$
        .map((mouseEvent: MouseEvent) => {
            const { offsetX: x, offsetY: y } = mouseEvent;
            return {
                heightFactor: scaleFactor(y),
                lean: scaleLean(x)
            };
        })
        .startWith({ heightFactor: 0, lean: 0 });

    const args$ = xs.combine(factorAndLean$, xs.periodic(500).take(realMax))
        .map(([{ heightFactor, lean }, maxlvl]) => ({
            w: 80,
            heightFactor,
            lean,
            x: svgDimensions.width / 2 - 40,
            y: svgDimensions.height - 80,
            lvl: 0,
            maxlvl: maxlvl + 1,
            left: false,
            right: false
        }));

    const pythagoras$ = Pythagoras(args$);

    const vtree$ = xs.combine(pythagoras$, throttleSinks.DOM)
        .map(([pythagoras, throttle]) =>
            div(Styles.App, [
                div(Styles.AppHeader, [
                    img(Styles.AppLogo, { attrs: { src: 'cyclejs_logo.svg' } }),
                    h2(Styles.Heading, 'This is a dancing Pythagoras tree')
                ]),
                div(Styles.AppIntro, [
                    ...throttle,
                    svg('#the-svg',
                        { attrs: { height: svgDimensions.height, width: svgDimensions.width, style: 'border: 1px solid lightgray; margin: 0.5em 0 0.75em;' } },
                        [pythagoras]
                    ),
                    div(Styles.Credits, [
                        'Built by ',
                        a({ attrs: { href: 'http://twitter.com/waynemaurer' } }, ['@waynemaurer']),
                        ' with ',
                        a({ attrs: { href: 'http://cycle.js.org' } }, ['Cycle.js']),
                        ' and ',
                        a({ attrs: { href: 'http://typestyle.io' } }, ['Typestyle']),
                        '. Source code ',
                        a({ attrs: { href: 'http://github.com/wmaurer/cyclejs-fractals/' } }, ['here'])
                    ])
                ])
            ])
        );

    return {
        DOM: vtree$
    };
}
