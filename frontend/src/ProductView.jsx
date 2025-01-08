import ReactDOM from 'react-dom/client'; 
import React from 'react';  
import {useTable} from 'react-table' 
import './table.css'
import {useEffect,useState} from 'react';   
function DataTable({columns,data}){ 
  const Table = useTable({
    columns, 
    data,
    manualPagination: true, 
    defaultCanSort: true 
  }); 
 
  return(
  <div id="tableContainer">
  <table id="tableDisplayer" {...Table.getTableProps()} border="1">
    <thead>
      {Table.headerGroups.map((headerGroup) => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <th {...column.getHeaderProps()}>{column.render("Header")}</th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody {...Table.getTableBodyProps()}>
      {Table.rows.length > 0 ? (
        Table.rows.map((row) => {
          Table.prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan={Table.columns.length} style={{ textAlign: "center", padding: "20px" }}>
           Your Inventory Will Appear Here
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
  )
}

function ProductTable(props){
  
  const [data, setData] = useState([]); 
  const columns=
  [
    
    {
      id:'product_id',
      Header: 'Product ID',
      accessor:'product_id',
    },
    {
      id:'product_image',
      Header:'Product Image',
      accessor:'product_image'
    },
    {
      id:'product_name',
      Header: 'Product Name', 
      accessor: 'product_name'
    },
    {
      id:'price',
      Header: 'Product Price',
      accessor: 'product_price'
    },
    {
      id:'quantity',
      Header: 'Product Quantity',
      accessor:'quantity'
    },
    {
      id:'total_value',
      Header:'Total Value',
      accessor: 'total_value'
    },
    {
      id:'brand', 
      Header:'Product Brand',
      accessor:'brand'
    },
    
  ] 
  // useEffect(() => {
  //   fetch(`http://localhost:3000/getAllProducts/${props.user_id}`, {
  //     method: 'GET',
  //   })
  //     .then((response) => response.json())
  //     .then((result) => {
  //       setData(result); 
  //       console.log(result);
  //     })
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, [props.user_id]); 
  // if(!data){
  //  return(
  //   <div>
  //     Loading... 
  //   </div>
  //  )
  // } 

  return(
    <div> 
      <h1 className="title">Product Table</h1> 
      <DataTable columns={columns} data={data}/> 
    </div> 
  )

}


export default ProductTable