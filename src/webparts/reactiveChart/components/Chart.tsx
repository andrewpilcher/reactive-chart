import * as React from 'react';
import styles from './Chart.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import SharePointService from '../../../services/SharePoint/SharePointService';
import { IListItem } from '../../../services/SharePoint/IListItem';
import { Bar } from 'react-chartjs-2';

export interface IChartProps {
    chartTitle: string;
}

export interface IChartState {
    items: IListItem[];
    loading: boolean;
    error: string | null;
}

export default class Chart extends React.Component<IChartProps, IChartState> {
    constructor(props: IChartProps) {
        super(props);
        // bind methods
        this.getItems = this.getItems.bind(this);

        // set initial state
        this.state = {
            items: [],
            loading: false,
            error: null,
        };
    }
    public render(): React.ReactElement<IChartProps> {
        return (
            <div className={styles.chartTitle}>
                <h1>{escape(this.props.chartTitle)}</h1>

                {this.state.error && <p>{this.state.error} </p>}

                <Bar data={{
                    labels: ['Jan', 'Feb', 'Mar'],
                    datasets: [
                        {
                            label: 'Apples',
                            data: [ 15, 9, 11],
                        },
                        {
                            label: 'Oranges',
                            data: [ 20, 19, 5],
                        },
                        {
                            label: 'Bananas',
                            data: [ 4, 2, 7],
                        }
                    ]
                }}/>


                <ul>
                    {this.state.items.map(item => {
                        return (
                            <li key={item.Id}>
                                <strong>{item.Title}</strong> ({item.Id})
                            </li>

                        );
                    })}
                </ul>
                <button onClick={this.getItems} disabled={this.state.loading}>{this.state.loading ? 'Loading...' : 'Refresh'}</button>
            </div>
        );
    }

    public getItems(): void {
        this.setState({ loading: true });
        SharePointService.getListItems('97140218-63A4-4732-BF07-720E33FA95B3').then(
            items => {
                this.setState({ error: null, items: items.value, loading: false });
            }
        ).catch(error =>  {
            this.setState({error: error, loading: false});
        });
    }
}
