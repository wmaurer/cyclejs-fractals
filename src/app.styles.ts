import { style as ts_style, cssRule, types } from 'typestyle';
import { color, px } from 'csx';
import * as csstips from 'csstips';

export namespace Styles {
    export const App = style({ textAlign: 'center' });

    export const AppHeader = style({
        backgroundColor: '#222',
        height: '120px',
        padding: '10px',
        color: 'white'
    });

    export const AppLogo = style({ height: '50px' });

    export const Heading = style({ margin: '0.5em 0' });

    export const AppIntro = style(
        csstips.vertical,
        csstips.center,
        { fontSize: 'large', margin: '0.5em 0' }
    );

    export const ThrottleText = style({ fontSize: '0.9em' });

    export const InputRange = style({ marginBottom: '1em' });

    export const Credits = style({ color: '#c5c5c5', fontSize: '0.7em' });
}

export function setupApplicationBaseStyles() {
    cssRule('a, a:visited', { color: '#25858e'})
    setupInputRangeStyles();
}

function setupInputRangeStyles() {
    const trackColor = color('#25858e');
    const thumbColor = '#52c569';

    const thumbRadius = '0';
    const thumbHeight = 30;
    const thumbWidth = '30px';
    const thumbShadowSize = '1px';
    const thumbShadowBlur = '1px';
    const thumbShadowColor = '#111';
    const thumbBorderWidth = '1px';
    const thumbBorderColor = '#fff';

    const trackWidth = '600px';
    const trackHeight = 10;
    const trackShadowSize = '2px';
    const trackShadowBlur = '2px';
    const trackShadowColor = '#222';
    const trackBorderWidth = 1;
    const trackBorderColor = '#2d708e';

    const trackRadius = 0;
    const contrast = '5%';

    const shadow = (shadowSize: string, shadowBlur: string, shadowColor: string): types.CSSProperties => ({
        boxShadow: `box-shadow: ${shadowSize} ${shadowSize} ${shadowBlur} ${shadowColor}, 0 0 ${shadowSize} lighten(${shadowColor}, 5%)`
    });

    const track = (): types.CSSProperties => ({
        cursor: 'pointer',
        height: px(trackHeight),
        transition: 'all .2s ease',
        width: trackWidth
    });

    const thumb = () => ({
        ...shadow(thumbShadowSize, thumbShadowBlur, thumbShadowColor),
        backgroundColor: thumbColor,
        border: `${thumbBorderWidth} solid ${thumbBorderColor}`,
        borderRadius: thumbRadius,
        cursor: 'pointer',
        height: thumbHeight,
        width: thumbWidth
    });

    cssRule(`[type='range']`, {
        '-webkit-appearance': 'none',
        margin: `${px(thumbHeight / 2)} 0`,
        width: trackWidth
    });
    cssRule(`[type='range']:focus`, {
        outline: 'none'
    });
    cssRule(`[type='range']:focus::-webkit-slider-runnable-track`, {
        background: trackColor.lighten(contrast).toString()
    });
    cssRule(`[type='range']:focus::-ms-fill-lower`, {
        background: trackColor.toString()
    });
    cssRule(`[type='range']:focus::-ms-fill-upper`, {
        background: trackColor.lighten(contrast).toString()
    });

    cssRule(`[type='range']::-webkit-slider-runnable-track`, {
        ...track(),
        ...shadow(trackShadowSize, trackShadowBlur, trackShadowColor),
        background: trackColor.toString(),
        border: `${px(trackBorderWidth)} solid ${trackBorderColor}`,
        borderRadius: trackRadius
    });

    cssRule(`[type='range']::-webkit-slider-thumb`, {
        ...thumb(),
        '-webkit-appearance': 'none',
        marginTop: `${px(((-trackBorderWidth * 2 + trackHeight) / 2) - (thumbHeight / 2))}`
    });

    cssRule(`[type='range']::-moz-range-track`, {
        ...track(),
        ...shadow(trackShadowSize, trackShadowBlur, trackShadowColor),
        background: trackColor.toString(),
        border: `${px(trackBorderWidth)} solid ${trackBorderColor}`,
        borderRadius: trackRadius
    });

    cssRule(`[type='range']::-moz-range-thumb`, { ...thumb() });

    cssRule(`[type='range']::-ms-track`, {
        ...track(),
        background: 'transparent',
        borderColor: 'transparent',
        borderWidth: `px(${thumbHeight / 2}) 0`,
        color: 'transparent'
    });

    cssRule(`[type='range']::-ms-fill-lower`, {
        ...shadow(trackShadowSize, trackShadowBlur, trackShadowColor),
        background: trackColor.darken(contrast).toString(),
        border: `${px(trackBorderWidth)} solid ${trackBorderColor}`,
        borderRadius: `${px(trackRadius * 2)}`
    })

    cssRule(`[type='range']::-ms-fill-upper`, {
        ...shadow(trackShadowSize, trackShadowBlur, trackShadowColor),
        background: trackColor.toString(),
        border: `${px(trackBorderWidth)} solid ${trackBorderColor}`,
        borderRadius: `${px(trackRadius * 2)}`
    })

    cssRule(`[type='range']::-ms-thumb`, {
        ...thumb(),
        marginTop: '0'
    });
}

function style(...objects: types.NestedCSSProperties[]) {
    return `.${ts_style(...objects)}`;
}
