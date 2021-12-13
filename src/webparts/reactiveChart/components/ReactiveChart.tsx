import * as React from 'react';
import styles from './ReactiveChart.module.scss';
import { IReactiveChartProps } from './IReactiveChartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Chart from './Chart';

export default class ReactiveChart extends React.Component<IReactiveChartProps, {}> {
  public render(): React.ReactElement<IReactiveChartProps> {
    return (
      <Chart
      description={this.props.description}
      listId={this.props.listId}
      selectedFields={this.props.selectedFields}
      chartType={this.props.chartType}
      chartTitle={this.props.chartTitle}
      chartColors={this.props.chartColors} />
    );
  }


}
