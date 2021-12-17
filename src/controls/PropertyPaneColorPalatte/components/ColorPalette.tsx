import * as React from 'react';
import * as strings from 'ReactiveChartWebPartStrings';
import { ColorSwatch } from './ColorSwatch';
import styles from './ColorPalette.module.scss';
import { Icon } from '@fluentui/react/lib/Icon';

export interface IColorPaletteProps {
    colors: string[];
    disabled?: boolean;
    onChanged(colors: string[]): void;
}

export class ColorPalette extends React.Component<IColorPaletteProps> {
    constructor(props: IColorPaletteProps) {
        super(props);

        // bindings
        this.onChanged = this.onChanged.bind(this);
        this.addColor = this.addColor.bind(this);
    }

    /**
     * render
    : JSXElement    
    */
    public render(): React.ReactElement<IColorPaletteProps> { // JSX.Element { // 
        return (
            <div className={ styles.colorGrid }>
                {this.props.colors.map((color, i) => {
                    return (
                            <ColorSwatch key={i}
                                color={color}
                                onColorChanged={(newColor) => this.onChanged(newColor, i)}
                                onColorDeleted={() => this.onChanged(null, i)}
                            />
                    );
                })}
                <button className={ styles.addColorBtn } onClick={this.addColor} >
                <Icon iconName={ 'Add' } title="Add" ariaLabel={strings.AddColor} />
                </button>
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

    public addColor(): void {
        let updatedColors = this.props.colors;
        updatedColors.push('#eeac00');
        this.props.onChanged(updatedColors);
    }
}