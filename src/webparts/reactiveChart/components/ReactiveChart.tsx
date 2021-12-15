import * as React from 'react';
import styles from './ReactiveChart.module.scss';
import { IReactiveChartProps } from './IReactiveChartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Chart from './Chart';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as strings from 'ReactiveChartWebPartStrings';
// import * as strings from 'ReactiveChartWebPartStrings';
// import * as FluentUI from '@fluentui/react';

export default class ReactiveChart extends React.Component<IReactiveChartProps, {}> {
  public render(): React.ReactElement<IReactiveChartProps> {
    return (
      <div>
       {this.props.listId && this.props.selectedFields.length ? 
      <Chart
      description={this.props.description}
      listId={this.props.listId}
      selectedFields={this.props.selectedFields}
      chartType={this.props.chartType}
      chartTitle={this.props.chartTitle}
      chartColors={this.props.chartColors}
      colors={this.props.colors } /> :
      <MessageBar>{strings.NoListWarning}</MessageBar> }
      </div>
    );
  }


}
