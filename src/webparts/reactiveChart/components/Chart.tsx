import * as React from 'react';
import styles from './Chart.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import SharePointService from '../../../services/SharePoint/SharePointService';
import { IListItem } from '../../../services/SharePoint/IListItem';
import { Chart as RChart} from 'react-chartjs-2';
import { Chart as ChartJS, BarController, LineController, LineElement, BarElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarController, LineController, LineElement, BarElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

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
        this.chartData = this.chartData.bind(this);

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

                <RChart type='bar' data={{labels: [ 'ET109', 'FCS120', 'KIN057', 'KIN114', 'NUR065', 'SPA005','SPA205'], datasets: this.chartData()}} />


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
                console.info(items);
            }
        ).catch(error => {
            this.setState({ error: error, loading: false });
        });
    }

    public chartData(): any {

        const datasets = [];
        const colors = [
            '#eeac00',
            '#000000',
            '#727473',
        ]

        this.state.items.map((item, i) => {
            const dataset = {
                label: item.Title,
                data: [
                    item.OData__x0045_T109,
                    item.OData__x0046_CS120,
                    item.OData__x004b_IN057,
                    item.OData__x004b_IN114,
                    item.OData__x004e_UR065,
                    item.OData__x0053_PA005,
                    item.OData__x0053_PA205
                ],
                backgroundColor: colors[i%colors.length]
            };
            datasets.push(dataset);
        });

        return datasets;
    }
}
