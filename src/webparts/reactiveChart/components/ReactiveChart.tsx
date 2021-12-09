import * as React from 'react';
import styles from './ReactiveChart.module.scss';
import { IReactiveChartProps } from './IReactiveChartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Chart from './Chart';

export default class ReactiveChart extends React.Component<IReactiveChartProps, {}> {
  public render(): React.ReactElement<IReactiveChartProps> {
    return (
      <div className={ styles.reactiveChart }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <Chart chartTitle="Welcome to Charts"/>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Refresh</span>
              </a>
            </div>
          </div>
        </div>
        
      </div>
    );
  }

  
}
