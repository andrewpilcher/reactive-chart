import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Environment, Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { PropertyPaneColorPalette } from '../../controls/PropertyPaneColorPalatte/PropertyPaneColorPalette';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';
import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';

import * as strings from 'ReactiveChartWebPartStrings';
import ReactiveChart from './components/ReactiveChart';
import { IReactiveChartProps } from './components/IReactiveChartProps';
import SharePointService from '../../services/SharePoint/SharePointService';
import { ThemeSettingName } from 'office-ui-fabric-react';


export interface IReactiveChartWebPartProps {
  description: string;
  listId: string;
  selectedFields: string[];
  chartType: string;
  chartTitle: string;
  colors: string[];
  chartColors: string;
  chartColors1: string;
  chartColors2: string;

}

export default class ReactiveChartWebPart extends BaseClientSideWebPart<IReactiveChartWebPartProps> {
  // list options state
  private listOptions: IPropertyPaneDropdownOption[];
  private listOptionsLoading: boolean = false;

  private fieldOptions: IPropertyPaneDropdownOption[];
  private fieldOptionsLoading: boolean = false;

  public render(): void {
    const element: React.ReactElement<IReactiveChartProps> = React.createElement(
      ReactiveChart,
      {
        description: this.properties.description,
        listId: this.properties.listId,
        selectedFields: this.properties.selectedFields,
        chartType: this.properties.chartType,
        chartTitle: this.properties.chartTitle,
        colors: this.properties.colors,
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
                PropertyPaneTextField('chartTitle', {
                  label: strings.ChartTitleFieldLabel
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown('listId', {
                  label: strings.ListIdFieldLabel,
                  options: this.listOptions,
                  disabled: this.listOptionsLoading,
                }),
                PropertyFieldMultiSelect('selectedFields', {
                  key: 'multiSelect',
                  label: strings.SelectedFieldsFieldLabel,
                  options: this.fieldOptions,
                  disabled: this.fieldOptionsLoading,
                  selectedKeys: this.properties.selectedFields
                }),
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
                new PropertyPaneColorPalette('colors', {
                  label: strings.ChartColorsFieldLabel,
                  colors: this.properties.colors,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  key: 'colIDKkey'
                }),

                // PropertyFieldColorPicker('chartColors', {
                //   label: strings.ChartColorsFieldLabel,
                //   selectedColor: this.properties.chartColors,
                //   onPropertyChange: this.onPropertyPaneFieldChanged,
                //   properties: this.properties,
                //   disabled: false,
                //   debounce: 1000,
                //   isHidden: false,
                //   alphaSliderHidden: false,
                //   style: PropertyFieldColorPickerStyle.Inline,
                //   iconName: 'Precipitation',
                //   key: 'colorFieldId0'
                // }),
                // PropertyFieldColorPicker('chartColors1', {
                //   label: strings.ChartColorsFieldLabel,
                //   selectedColor: this.properties.chartColors1,
                //   onPropertyChange: this.onPropertyPaneFieldChanged,
                //   properties: this.properties,
                //   disabled: false,
                //   debounce: 1000,
                //   isHidden: false,
                //   alphaSliderHidden: false,
                //   style: PropertyFieldColorPickerStyle.Inline,
                //   iconName: 'Precipitation',
                //   key: 'colorFieldId1'
                // }),
                // PropertyFieldColorPicker('chartColors2', {
                //   label: strings.ChartColorsFieldLabel,
                //   selectedColor: this.properties.chartColors2,
                //   onPropertyChange: this.onPropertyPaneFieldChanged,
                //   properties: this.properties,
                //   disabled: false,
                //   debounce: 1000,
                //   isHidden: false,
                //   alphaSliderHidden: false,
                //   style: PropertyFieldColorPickerStyle.Inline,
                //   iconName: 'Precipitation',
                //   key: 'colorFieldId2'
                // })
              ]
            }
          ]
        }
      ]
    };
  }

  private getLists(): Promise<IPropertyPaneDropdownOption[]> {
    this.listOptionsLoading = true;
    this.context.propertyPane.refresh();

    return SharePointService.getLists().then(lists => {
      this.listOptionsLoading = false;
      this.context.propertyPane.refresh();

      return lists.value.map(list => {
        return {
          key: list.Id,
          text: list.Title,
        };
      });
    });
  }

  public getFields(): Promise<IPropertyPaneDropdownOption[]> {
    //no list selected
    if (!this.properties.listId) return Promise.reject();

    this.fieldOptionsLoading = true;
    this.context.propertyPane.refresh();

    return SharePointService.getListFields(this.properties.listId).then(fields => {
      this.fieldOptionsLoading = false;
      this.context.propertyPane.refresh();

      return fields.value.map(field => {
        return {
          key: field.Title,
          text: `${field.Title} (${field.TypeAsString})`,
        };
      });
    });
  }

  protected onPropertyPaneConfigurationStart(): void {
    this.getLists().then(listOptions => {
      this.listOptions = listOptions;
      // force a refresh
      this.context.propertyPane.refresh();
    }).then(() => {
      this.getFields().then(fieldOptions => {
        this.fieldOptions = fieldOptions;
        this.context.propertyPane.refresh();
      });
    });
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

      if (propertyPath === 'listId' && newValue) {
        this.properties.selectedFields = [];
        this.getFields().then(fieldOptions => {
          this.fieldOptions = fieldOptions;
          this.context.propertyPane.refresh();
        });
      } else if (propertyPath === 'colors' && newValue) {
        this.properties.colors = newValue;
        this.context.propertyPane.refresh();
        this.render();
      }
  }

}
