declare interface IReactiveChartWebPartStrings {
  PropertyPaneDescription: string;
  DataGroupName: string;
  StyleGroupName: string;
  DescriptionFieldLabel: string;
  ListIdFieldLabel: string;
  SelectedFieldsFieldLabel: string;
  ChartTypeFieldLabel: string;
  ChartTitleFieldLabel: string;
  ChartColorsFieldLabel: string;
  LoadingSpinnerText: string;
  Loading: string;
  Refresh: string;
  FetchError: string;
  NoListWarning: string;
}

declare module 'ReactiveChartWebPartStrings' {
  const strings: IReactiveChartWebPartStrings;
  export = strings;
}
