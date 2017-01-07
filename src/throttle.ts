import { VNode, div, input } from '@cycle/dom';
import { DOMSource } from '@cycle/dom/xstream-typings';
import { Styles } from './app.styles';
import { MemoryStream } from 'xstream';

export function Throttle(sources: { DOM: DOMSource }) {
    const throttle$ = sources.DOM.select('.throttle-input').events('input')
        .map(ev => parseInt((ev.target as HTMLInputElement).value))
        .startWith(0);

    const vtree$ = throttle$.map(value => ([
        div(Styles.ThrottleText, [`Throttle: ${value}ms`]),
        input(Styles.InputRange + '.throttle-input', { attrs: { type: 'range', min: 0, max: 300, value }}),
    ]));

    return {
        throttle: throttle$,
        DOM: vtree$
    };
}
