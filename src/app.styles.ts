import { style as ts_style, cssRule, types } from 'typestyle';

export namespace Styles {
    export const App = style({ textAlign: 'center' });

    export const AppHeader = style({
        backgroundColor: '#222',
        height: '150px',
        padding: '20px',
        color: 'white'
    });

    export const AppLogo = style({
        height: '50px'
    });

    export const AppIntro = style({ fontSize: 'large' });

    export const Svg = style({
        border: '1px solid lightgray'
    });
}

function style(...objects: types.NestedCSSProperties[]) {
    return `.${ts_style(...objects)}`;
}
