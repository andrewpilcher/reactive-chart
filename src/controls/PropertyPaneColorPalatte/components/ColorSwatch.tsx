import * as React from 'react';
import { Callout, ColorPicker, IColor, DirectionalHint } from 'office-ui-fabric-react';

export interface IColorSwatchProps {
    color: string;
    key: number;
    onColorChanged(color: string): void;
    onColorDeleted(): void;
}

export interface IColorSwatchState {
    picking: boolean;
}

export class ColorSwatch extends React.Component<IColorSwatchProps, IColorSwatchState> {
    constructor(props: IColorSwatchProps) {
        super(props);

        // bindings
        this.pick = this.pick.bind(this);


        // state
        this.state = {
            picking: false,
        };
    }
    public render(): React.ReactElement<IColorSwatchProps> { // JSX.Element { // 
        return (
            <div>
                <button onClick={this.pick} id={`pickBtn-${this.props.key}`}>Pick</button>
                <Callout hidden={!this.state.picking} target={`#pickBtn-${this.props.key}`} onDismiss={this.pick} directionalHint={DirectionalHint.leftTopEdge}>
                    <ColorPicker color={this.props.color} onChange={(ev: any, colorObj: IColor) => this.props.onColorChanged('#' + colorObj.hex)} />
                    <button onClick={this.props.onColorDeleted}>Delete</button>
                </Callout>
            </div>
        );

    }

    public pick(): void {
        this.setState({ picking: !this.state.picking });
    }
}

// import * as React from 'react';
// import {
//   ColorPicker,
//   getColorFromString,
//   IColor,
// } from '@fluentui/react/lib/index';

// const white = getColorFromString('#ffffff')!;

// export const ColorSwatch: React.FunctionComponent = () => {
//   const [color, setColor] = React.useState(white);
//   const updateColor = React.useCallback((ev: any, colorObj: IColor) => setColor(colorObj), []);

//   return (
//     <div style={{ display: 'flex' }}>
//       <ColorPicker
//         color={color}
//         onChange={updateColor}
//         alphaType='transparency'
//         showPreview={true}
//         styles={{
//             panel: { padding: 12 },
//             root: {
//               maxWidth: 352,
//               minWidth: 352,
//             },
//             colorRectangle: { height: 268 },
//           }}
//         // The ColorPicker provides default English strings for visible text.
//         // If your app is localized, you MUST provide the `strings` prop with localized strings.
//         strings={{
//           // By default, the sliders will use the text field labels as their aria labels.
//           // Previously this example had more detailed instructions in the labels, but this is
//           // a bad practice and not recommended. Labels should be concise, and match visible text when possible.
//           hueAriaLabel: 'Hue',
//         }}
//       />
//     </div>
//   );
// };