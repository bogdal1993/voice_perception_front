import React from 'react';
import { formatDateTime } from '../utils/dateUtils';

interface ICol{
  heading: string
  value: string
}

interface ITable {
  data:any[]
  column:ICol[]
  setCallid:(call:string, item: any) => {}
}

interface ITableHeadin {
  item: any
}

interface ITableRow {
  item: any
  column:ICol[]
  setCallid:(call:string, item: any) => {}
}

export const Table = ( table:ITable ) => {
    return (
      <table>
        <thead>
          <tr>
            {table.column.map((item, index) => <TableHeadItem key={item.heading} item={item} />)}
          </tr>
        </thead>
        <tbody>
          {table.data.map((item, index) => <TableRow key={item.call_uuid || index} item={item} column={table.column} setCallid={table.setCallid} />)}
        </tbody>
      </table>
    )
  }
  
  const TableHeadItem = (itemP:ITableHeadin) => {
    let width = "10%";
        if(itemP.item.heading=="text"){
          width="30%"
        }
    return(<td width={width}>{itemP.item.heading}</td>)
  }

  const TableRow = (tableRowProp:ITableRow) => (
    <tr id={tableRowProp.item['call_uuid']} onClick={() => {
          tableRowProp.setCallid(tableRowProp.item['call_uuid'], tableRowProp.item);
          return false
        }
      }>
      {tableRowProp.column.map((columnItem, index) => {

        if(columnItem.value.includes('.')) {
          const itemSplit = columnItem.value.split('.') //['address', 'city']
          return <td key={columnItem.value}>{tableRowProp.item[itemSplit[0]][itemSplit[1]]}</td>;
        }
        let width = "10%";
        if(columnItem.value=="text"){
          width="30%"
        }

        // Format call_start_ts with our utility function
        const cellValue = columnItem.value === 'call_start_ts'
          ? formatDateTime(tableRowProp.item[`${columnItem.value}`])
          : tableRowProp.item[`${columnItem.value}`];

        return (
            <td key={columnItem.value} width={width}>{cellValue}</td>
        )
      })}
    </tr>
  )
  
  export default Table
