import React from 'react';
import { PieComponent } from './chartsComponents/pieComponent';
import { TagComponent } from './chartsComponents/tagComponent';
import { LineComponent } from './chartsComponents/lineComponent';
import { IChart } from '../models'; // Import IChart to use its span type
import { IoIosMenu, IoMdClose, IoMdRefresh } from 'react-icons/io';
import { ChartContext } from '../context/chartsContext';
import { useContext, useState } from 'react';

interface ChartComponentProps {
    type: 'PieComponent' | 'TagComponent' | 'LineComponent';
    filter: any; // Consider defining a more specific type for filter
    datasource: any; // Consider defining a more specific type for datasource
    chartname: string;
    span: IChart<any>['span']; // Use the updated span type from IChart
}

const components: Record<ChartComponentProps['type'], React.ComponentType<any>> = {
    PieComponent,
    TagComponent,
    LineComponent
};

export function ChartComponent({ type, filter, datasource, chartname, span }: ChartComponentProps) {
    const Module = components[type];
    const chartctx = useContext(ChartContext);
    const [hideSettings, setHideSettings] = useState<boolean>(false); // State for showing/hiding filter form
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0); // State to trigger refresh in child

    if (!Module) {
        // Handle the case where the component type is not found
        console.error(`Component type ${type} not found.`);
        return null;
    }

    // Pass width and height from span to the Module, as react-grid-layout will control the parent div's size
    return (
        <div className="chart"> {/* Use a generic chart class, react-grid-layout handles sizing */}
            <div className="chart-header-handle">
                <h3>{chartname} <span style={{ fontSize: '0.7em', color: '#888' }}>({datasource} {type})</span></h3> {/* Display chart name and type in the header */}
                <div className="chart-actions">
                    <IoIosMenu onClick={() => setHideSettings(prev => !prev)}></IoIosMenu>
                    <IoMdRefresh onClick={() => setRefreshTrigger(prev => prev + 1)}></IoMdRefresh>
                    <IoMdClose onClick={() => chartctx.remove(chartname)}></IoMdClose>
                </div>
            </div>
            <div className="chart-content">
                <Module filter={filter} type={type} datasource={datasource} chartname={chartname} span={span} hide={hideSettings} setHide={setHideSettings} refreshTrigger={refreshTrigger} />
            </div>
        </div>
    );
}
