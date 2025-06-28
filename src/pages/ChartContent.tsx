import { useContext, useState, useEffect } from 'react';
import { NavigationContext } from '../context/navContext';
import { ChartComponent } from '../components/ChartComponent.tsx';
import { ChartContext, ChartState } from '../context/chartsContext';
import { IoIosAdd } from 'react-icons/io';
import { chartData } from '../data/chartsData';
import { IChart } from '../models';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function ChartContent() {
    const Inav = useContext(NavigationContext);
    const mainActiveClassname = Inav.navigationOpen ? 'active' : '';
    const mainClassnames = ['main', 'overflowauto', mainActiveClassname];
    const [hide, setHide] = useState<boolean>(false);
    const chartctx = useContext(ChartContext);

    const [chartname, setName] = useState<string>("");
    const [charttype, setCharttype] = useState<string>("-1");
    const FormContainerClassnames = ['FiltersForm', "Width100"];

    // Derive layouts directly from chartctx.data
    const currentLayouts = {
        lg: chartctx.data.map(chart => ({
            i: chart.chartname, // Use chartname as the unique identifier for grid items
            x: chart.span?.x || 0, // Default to 0 if not set
            y: chart.span?.y || 0, // Default to 0 if not set
            w: chart.span?.w || 2, // Default width
            h: chart.span?.h || 2, // Default height
                    minW: 2,
                    maxW: 4,
                    minH: 3,
                    maxH: 5,
        })),
    };

    function addChart(i: string) {
        if (i === "-1") {
            return;
        } else {
            // When adding a new chart, ensure it has initial span properties
            // Ensure chartname is unique for react-grid-layout's 'i' prop
            let uniqueChartname = chartname;
            let counter = 1;
            while (chartctx.data.some(chart => chart.chartname === uniqueChartname)) {
                uniqueChartname = `${chartname}-${counter}`;
                counter++;
            }

            const newChart: IChart<any> = {
                ...chartData[Number(i)],
                chartname: uniqueChartname, // Use unique chartname
                span: {
                    x: (chartctx.data.length % 4) * 2, // Simple initial x position
                    y: Math.floor(chartctx.data.length / 4) * 2, // Simple initial y position
                    w: 2, // Default width for new chart
                    h: 3, // Default height for new chart
                    minW: 2,
                    maxW: 4,
                    minH: 3,
                    maxH: 5,
                }
            };
            chartctx.add(newChart);
            setHide(false);
            setName(""); // Clear chart name input after adding
        }
    }

    const onLayoutChange = (layout: any[], allLayouts: any) => {
        // Update chartctx.data with new layout dimensions and positions
        const updatedCharts = chartctx.data.map(chart => {
            const layoutItem = layout.find(item => item.i === chart.chartname);
            if (layoutItem) {
                return {
                    ...chart,
                    span: {
                        x: layoutItem.x,
                        y: layoutItem.y,
                        w: layoutItem.w,
                        h: layoutItem.h,
                        minW: layoutItem.minW,
                        maxW: layoutItem.maxW,
                        minH: layoutItem.minH,
                        maxH: layoutItem.maxH,
                    }
                };
            }
            return chart;
        });
        chartctx.setAllCharts(updatedCharts); // Update all charts in context
    };

    return (
        <div className={mainClassnames.join(' ')}>
            <ResponsiveGridLayout
                className="layout"
                layouts={currentLayouts} // Use derived layouts
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 8, md: 6, sm: 4, xs: 2, xxs: 1 }}
                rowHeight={100} // Adjust row height as needed
                onLayoutChange={onLayoutChange}
                compactType="vertical" // Compact charts vertically
                preventCollision={false} // Allow temporary collisions during drag
                draggableHandle=".chart-header-handle" // Specify the drag handle
                draggableCancel=".chart-actions" // Exclude chart-actions from being draggable
            >
                {chartctx.data.map((chart) => (
                    <div key={chart.chartname} data-grid={chart.span} className="chart-grid-item">
                        <ChartComponent
                            type={chart.type}
                            datasource={chart.datasource}
                            filter={chart.filter}
                            chartname={chart.chartname}
                            span={chart.span}
                        />
                    </div>
                ))}
            </ResponsiveGridLayout>
            <div className="chart-add-footer">
                <div className="chart-add-button-container">
                    {!hide &&
                        <div className='addChart' onClick={() => setHide(prev => !prev)}>
                            <IoIosAdd />
                        </div>
                    }
                    {hide && <div className={FormContainerClassnames.join(' ')}>
                        <button onClick={() => addChart(charttype)}>ADD</button>
                        <span>Chart name</span>
                        <input type="text" value={chartname} onChange={(e) => { setName(e.target.value); }} />
                        <span>Select type</span>
                        <select name="charttype" id="charttype" onChange={(e) => setCharttype(e.target.value)}>
                            <option value="-1"></option>
                            {chartData.map((chart, i) => <option key={i} value={i}>{chart.datasource} {chart.type}</option>)}
                        </select>
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}
