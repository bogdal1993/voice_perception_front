import { PieComponent } from './chartsComponents/pieComponent';
import { TagComponent } from './chartsComponents/tagComponent';
import { LineComponent } from './chartsComponents/lineComponent';


const components = {
    PieComponent,
    TagComponent,
    LineComponent
};

export function ChartComponent(chartType){

    const Module  = components[chartType.type];
    return(
        <Module filter={chartType.filter} type={chartType.type} datasource={chartType.datasource} chartname={chartType.chartname} span={chartType.span}/>
    )
}