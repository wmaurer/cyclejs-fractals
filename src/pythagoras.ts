import { VNode, svg } from '@cycle/dom'
import { DOMSource } from '@cycle/dom/xstream-typings'
import xs, { Stream } from 'xstream'
import { interpolateViridis } from 'd3-scale';

function deg(radians: number) {
    return radians * (180 / Math.PI);
}

const memoizedCalc = function (): (x: any) => { nextRight: number, nextLeft: number, A: number, B: number } {
    const memo = {};

    const key = ({ w, heightFactor, lean }: PythagorasArgs) => [w, heightFactor, lean].join('-');

    return (args: PythagorasArgs) => {
        const memoKey = key(args);

        if (memo[memoKey]) {
            return memo[memoKey];
        } else {
            const { w, heightFactor, lean } = args;

            const trigH = heightFactor * w;

            const result = {
                nextRight: Math.sqrt(trigH ** 2 + (w * (.5 + lean)) ** 2),
                nextLeft: Math.sqrt(trigH ** 2 + (w * (.5 - lean)) ** 2),
                A: deg(Math.atan(trigH / ((.5 - lean) * w))),
                B: deg(Math.atan(trigH / ((.5 + lean) * w)))
            };

            memo[memoKey] = result;
            return result;
        }
    }
}();

export interface PythagorasArgs {
    w: number;
    heightFactor: number;
    lean: number;
    x: number;
    y: number;
    lvl: number;
    maxlvl: number;
    left?: boolean;
    right?: boolean;
}

export const Pythagoras = (args$: Stream<PythagorasArgs>) => args$.map(pythagoras);

function pythagoras({ w, x, y, heightFactor, lean, left = false, right = false, lvl, maxlvl }: PythagorasArgs): VNode {
    if (lvl >= maxlvl || w < 1) {
        return null;
    }

    const { nextRight, nextLeft, A, B } = memoizedCalc({
        w: w,
        heightFactor: heightFactor,
        lean: lean
    });

    let rotate = '';

    if (left) {
        rotate = `rotate(${-A} 0 ${w})`;
    } else if (right) {
        rotate = `rotate(${B} ${w} ${w})`;
    }

    const leftArgs: PythagorasArgs = {
        w: nextLeft,
        x: 0,
        y: -nextLeft,
        lvl: lvl + 1,
        maxlvl,
        heightFactor,
        lean,
        left: true
    };

    const rightArgs: PythagorasArgs = {
        w: nextRight,
        x: w - nextRight,
        y: -nextRight,
        lvl: lvl + 1,
        maxlvl,
        heightFactor,
        lean,
        right: true
    };

    return svg.g({ attrs: { transform: `translate(${x} ${y}) ${rotate}` } }, [
        svg.rect({ attrs: { width: w, height: w, x: 0, y: 0, style: `fill: ${interpolateViridis(lvl / maxlvl)}` } }),
        pythagoras(leftArgs),
        pythagoras(rightArgs)
    ])
}
