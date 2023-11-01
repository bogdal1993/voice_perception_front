export interface IMenu {
    name: string,
    ion: any,
    url: string
}

export interface IChart<T> {
    type: string,
    filter: T | any,
    datasource: string,
    span: number[],
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
