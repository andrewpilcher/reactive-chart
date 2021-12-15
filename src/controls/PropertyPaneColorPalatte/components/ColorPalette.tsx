import * as React from 'react';
import * as strings from 'ReactiveChartWebPartStrings';
import { ColorSwatch } from './ColorSwatch';

export interface IColorPaletteProps {
    colors: string[];
    disabled?: boolean;
    onChanged(colors: string[]): void;
}

export class ColorPalette extends React.Component<IColorPaletteProps> {
    constructor(props: IColorPaletteProps) {
        super(props);

        // bindings
    }

    /**
     * render
    : JSXElement    
    */
    public render(): React.ReactElement<IColorPaletteProps> { // JSX.Element { // 
        return (
            <div>
                {this.props.colors.map((color, i) => {
                    return (
                        <ColorSwatch key={i} 
                        color={color} 
                        onColorChanged={(newColor) => this.onChanged(newColor, i)}
                        onColorDeleted={() => this.onChanged(null, i)}
                        />
                    );
                })}
            </div>
        );
        
    }

    /**
     * onChange
     */
    public onChanged(newColor: string, index: number): void {
        let updatedColors = this.props.colors;
        updatedColors[index] = newColor;

        if (newColor === null) {
            updatedColors.splice(index, 1);
        }

        this.props.onChanged(updatedColors);
        
    }
}