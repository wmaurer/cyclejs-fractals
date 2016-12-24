import { VNode, div, h2, svg, p, img } from '@cycle/dom';
import { DOMSource } from '@cycle/dom/xstream-typings';
import sampleCombine from 'xstream/extra/sampleCombine';
import xs, { Stream } from 'xstream';
import { Styles } from './app.styles';
import { normalize, setupPage } from 'csstips';
import { scaleLinear } from 'd3-scale';

import { Pythagoras } from './pythagoras';

normalize();
setupPage('#app');

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
    const factorAndLean$ = sources.DOM.select('#the-svg').events('mousemove')
        .map((mouseEvent: MouseEvent) => {
            const { offsetX: x, offsetY: y } = mouseEvent;
            const scaleFactor = scaleLinear().domain([svgDimensions.height, 0]).range([0, .8]);
            const scaleLean = scaleLinear().domain([0, svgDimensions.width / 2, svgDimensions.width]).range([.5, 0, -.5]);
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

    const vtree$ = pythagoras$.map(x =>
        div(Styles.App, [
            div(Styles.AppHeader, [
                img(Styles.AppLogo, { attrs: { src: 'cyclejs_logo.svg' } }),
                h2('This is a dancing Pythagoras tree')
            ]),
            p(Styles.AppIntro, [
                svg('#the-svg', { attrs: { height: svgDimensions.height, width: svgDimensions.width, style: 'border: 1px solid lightgray' } }, [ x ])
            ])
        ])
    );

    return {
        DOM: vtree$
    };
}
