import { IconType } from 'react-icons'; // Import IconType

export interface IMenu {
    title: string, // Changed from name to title
    url: string,
    ion?: any, // Optional ionicons icon
    icon?: IconType // Optional react-icons icon
}

export interface IChart<T> {
    type: 'PieComponent' | 'TagComponent' | 'LineComponent',
    filter: T | any,
    datasource: string,
    span: {
        x: number;
        y: number;
        w: number;
        h: number;
        minW?: number;
        maxW?: number;
        minH?: number;
        maxH?: number;
    },
    chartname: string
}

export interface IFilterBase {
    startDate: string;
    endDate: string;
    caller: string;
    callee: string;
    spk: string;
}

export interface IFilterCount {
    startDate: string;
    endDate: string;
    caller: string;
    callee: string;
    sampling: string;
}

export interface IFilterTagsCloud {
    startDate: string;
    endDate: string;
    caller: string;
    callee: string;
    spk: string;
    limit: number
    part: any[]
}
