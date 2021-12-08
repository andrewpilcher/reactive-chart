import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Environment, Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactiveChartWebPartStrings';
import ReactiveChart from './components/ReactiveChart';
import { IReactiveChartProps } from './components/IReactiveChartProps';
import SharePointService from '../../services/SharePoint/SharePointService';


export interface IReactiveChartWebPartProps {
  description: string;
}

export default class ReactiveChartWebPart extends BaseClientSideWebPart<IReactiveChartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IReactiveChartProps> = React.createElement(
      ReactiveChart,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public onInit(): Promise<void> {
    return super.onInit().then( () => {
      
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
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
