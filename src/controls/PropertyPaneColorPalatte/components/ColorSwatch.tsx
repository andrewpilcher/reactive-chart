import * as React from 'react';
import { ColorPicker } from 'office-ui-fabric-react/lib/ColorPicker';

export interface IColorSwatchProps {
    color: string;
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


        // state
        this.state = {
            picking: false,
        };
    }
    public render(): React.ReactElement<IColorSwatchProps> { // JSX.Element { // 
        return (
            <div>
                <ColorPicker color={this.props.color} onChange={event => this.props.onColorChanged()}/>

            </div>
        );
        
    }
}