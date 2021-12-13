import * as React from 'react';
import styles from './Chart.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import SharePointService from '../../../services/SharePoint/SharePointService';
import { IListItem } from '../../../services/SharePoint/IListItem';
import { Chart as RChart } from 'react-chartjs-2';
import { Chart as ChartJS, 
    Title, 
    BarController,
    LineController, 
    LineElement, 
    BarElement, 
    ArcElement,
    PointElement, 
    RadialLinearScale,
    LinearScale, 
    CategoryScale, 
    Tooltip, 
    Filler,
    Legend, 
    defaults } from 'chart.js';

ChartJS.register(
    Title, 
    BarController,
    LineController, 
    LineElement, 
    BarElement, 
    ArcElement,
    PointElement, 
    RadialLinearScale,
    LinearScale, 
    CategoryScale, 
    Tooltip, 
    Filler,
    Legend
    );


export interface IChartProps {
    description: string;
    listId: string;
    selectedFields: string[];
    chartType: string;
    chartTitle: string;
    chartColors: string[];
}

export interface IChartState {
    items: IListItem[];
    loading: boolean;
    error: string | null;
    chartLabels: string[];
    chartDatasets: any[];
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
            chartLabels: [],
            chartDatasets: [],
        };
    }
    public render(): React.ReactElement<IChartProps> {
        return (
            <div className={styles.chartTitle}>
                <h1>{escape(this.props.chartTitle)}</h1>

                {this.state.error && <p>{this.state.error} </p>}

                {this.props.chartType == 'bar' && <RChart type='bar' datasetIdKey='dsid' data={{ labels: this.state.chartLabels, datasets: this.state.chartDatasets}} />}
                {this.props.chartType == 'line' && <RChart type='line' datasetIdKey='dsid' data={{ labels: this.state.chartLabels, datasets: this.state.chartDatasets}} />}
                {this.props.chartType == 'doughnut' && <RChart type='doughnut' datasetIdKey='dsid' data={{ labels: this.state.chartLabels, datasets: this.state.chartDatasets}} />}
                {this.props.chartType == 'bubble' && <RChart type='bubble' datasetIdKey='dsid' data={{ labels: this.state.chartLabels, datasets: this.state.chartDatasets}} />}
                {this.props.chartType == 'pie' && <RChart type='pie' datasetIdKey='dsid' data={{ labels: this.state.chartLabels, datasets: this.state.chartDatasets}} />}
                {this.props.chartType == 'scatter' && <RChart type='scatter' datasetIdKey='dsid' data={{ labels: this.state.chartLabels, datasets: this.state.chartDatasets}} />}
                {this.props.chartType == 'radar' && <RChart type='radar' datasetIdKey='dsid' data={{ labels: this.state.chartLabels, datasets: this.state.chartDatasets}} />}
                {this.props.chartType == 'polarArea' && <RChart type='polarArea' datasetIdKey='dsid' data={{ labels: this.state.chartLabels, datasets: this.state.chartDatasets}} />}


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
        SharePointService.getListItems(this.props.listId).then(
            items => {
                this.setState({ error: null, items: items.value, loading: false });
                let data = {
                    labels: [],
                    datasets: []
                };

                items.value.map((item, i ) => {
                    let dataset = {
                        label: '',
                        data: [],
                        backgroundColor: this.props.chartColors[i % this.props.chartColors.length],
                        borderColor: this.props.chartColors[i % this.props.chartColors.length],

                    };
                    this.props.selectedFields.map((field, j) => {
                        // get value
                        let value = item[field];
                        if (i== 0 && j > 0) {
                            data.labels.push(field);
                        }

                        if (j ==0) {
                            dataset.label = value;
                        } else {
                            //prepend Odata_ to field name
                            if (value === undefined && item[`OData_${field}`] !== undefined)
                                value = item[`OData_${field}`];
                            if (field.search(/[0-9]/g))
                                value = item[`OData__x00${field.charCodeAt(0).toString(16)}_${field.substring(1)}`]
                            dataset.data.push(value);
                        }
                    });
                    data.datasets.push(dataset);
                });
                console.log(data);
                this.setState({chartLabels: data.labels, chartDatasets: data.datasets});
                console.info(items);
            }
        ).catch(error => {
            this.setState({ error: error, loading: false });
        });
    }
}
