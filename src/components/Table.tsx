import React from 'react';
import { formatDateTime, formatDuration } from '../utils/dateUtils';

interface ICol{
  heading: string
  value: string
}

interface ITable {
  data:any[]
  column:ICol[]
  setCallid:(call:string, item: any) => {}
  playingCallId: string | null
}

interface ITableHeadin {
  item: any
}

interface ITableRow {
  item: any
  column:ICol[]
  setCallid:(call:string, item: any) => {}
  playingCallId: string | null
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
          {table.data.map((item, index) => <TableRow key={item.call_uuid || index} item={item} column={table.column} setCallid={table.setCallid} playingCallId={table.playingCallId} />)}
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
    <tr
      id={tableRowProp.item['call_uuid']}
      onClick={() => {
          tableRowProp.setCallid(tableRowProp.item['call_uuid'], tableRowProp.item);
          return false
        }
      }
      className={`table-row-hover ${tableRowProp.playingCallId === tableRowProp.item['call_uuid'] ? 'table-row-active' : 'table-row-inactive'}`}
    >
      {tableRowProp.column.map((columnItem, index) => {

        if(columnItem.value.includes('.')) {
          const itemSplit = columnItem.value.split('.') //['address', 'city']
          return <td key={columnItem.value}>{tableRowProp.item[itemSplit[0]][itemSplit[1]]}</td>;
        }
        let width = "10%";
        if(columnItem.value=="text"){
          width="30%"
        }

        // Format call_start_ts and duration with our utility functions
        let cellValue = tableRowProp.item[`${columnItem.value}`];
        if (columnItem.value === 'call_start_ts') {
          cellValue = formatDateTime(tableRowProp.item[`${columnItem.value}`]);
        } else if (columnItem.value === 'duration') {
          cellValue = formatDuration(tableRowProp.item[`${columnItem.value}`]);
        } else if (columnItem.value === 'direction') {
          // Convert direction values for display
          cellValue = cellValue === 'inbound' ? 'in' : cellValue === 'outbound' ? 'out' : cellValue;
        }

        return (
            <td key={columnItem.value} width={width}>{cellValue}</td>
        )
      })}
    </tr>
  )
  
  export default Table
