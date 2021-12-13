import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Environment, Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';

import * as strings from 'ReactiveChartWebPartStrings';
import ReactiveChart from './components/ReactiveChart';
import { IReactiveChartProps } from './components/IReactiveChartProps';
import SharePointService from '../../services/SharePoint/SharePointService';


export interface IReactiveChartWebPartProps {
  description: string;
  listId: string;
  selectedFields: string;
  chartType: string;
  chartTitle: string;
  chartColors: string;
  chartColors1: string;
  chartColors2: string;

}

export default class ReactiveChartWebPart extends BaseClientSideWebPart<IReactiveChartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IReactiveChartProps> = React.createElement(
      ReactiveChart,
      {
        description: this.properties.description,
        listId: this.properties.listId,
        selectedFields: this.properties.selectedFields.split(','),
        chartType: this.properties.chartType,
        chartTitle: this.properties.chartTitle,
        chartColors: [
          this.properties.chartColors,
          this.properties.chartColors1,
          this.properties.chartColors2
        ]
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public onInit(): Promise<void> {
    return super.onInit().then(() => {

      //test methods
      SharePointService.setup(this.context, Environment.type);
      SharePointService.getLists().then(lists => {
        console.log(lists);
      });
      SharePointService.getListItems('idnumber-guid').then(items => {
        console.log(items);
      });
      // end tests

      console.log(`Reactive charts ready for ${this.context.pageContext.user.displayName}`);
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.DataGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('listId', {
                  label: strings.ListIdFieldLabel
                }),
                PropertyPaneTextField('selectedFields', {
                  label: strings.SelectedFieldsFieldLabel
                }),

                PropertyPaneTextField('chartTitle', {
                  label: strings.ChartTitleFieldLabel
                })
              ]
            }, {
              groupName: strings.StyleGroupName,
              groupFields: [
                PropertyPaneDropdown('chartType', {
                  label: strings.ChartTypeFieldLabel,
                  // put this in a lang file too
                  options: [
                    { key: 'bar', text: 'Bar' },
                    { key: 'line', text: 'Line' },
                    { key: 'doughnut', text: 'Doughnut' },
                    { key: 'pie', text: 'Pie' },
                    { key: 'radar', text: 'Radar' },
                    { key: 'bubble', text: 'Bubble' },
                    { key: 'scatter', text: 'Scatter' },
                    { key: 'polar', text: 'Polar' }
                  ]
                }),
                PropertyFieldColorPicker('chartColors', {
                  label: strings.ChartColorsFieldLabel,
                  selectedColor: this.properties.chartColors,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  debounce: 1000,
                  isHidden: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Inline,
                  iconName: 'Precipitation',
                  key: 'colorFieldId0'
                }),
                PropertyFieldColorPicker('chartColors1', {
                  label: strings.ChartColorsFieldLabel,
                  selectedColor: this.properties.chartColors1,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  debounce: 1000,
                  isHidden: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Inline,
                  iconName: 'Precipitation',
                  key: 'colorFieldId1'
                }),
                PropertyFieldColorPicker('chartColors2', {
                  label: strings.ChartColorsFieldLabel,
                  selectedColor: this.properties.chartColors2,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  debounce: 1000,
                  isHidden: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Inline,
                  iconName: 'Precipitation',
                  key: 'colorFieldId2'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
