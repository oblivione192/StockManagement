import React from 'react' 
import {useState,useEffect} from 'react'  
import 'bootstrap/dist/css/bootstrap.min.css';  
import './list.css';  


// function VerticalList(){ 
//     return(
//         <div>
//         </div>
//     )
// }
function ProductGridView({ data, accessors }) {
  const getValue = (object, accessor) => {
    return accessor.split('.').reduce((acc, key) => acc && acc[key], object);
  };

  const renderFields = (product, accessors) => {
    return accessors.map((header) => {
      if (header.children && header.children.length > 0) {
        return (
          <div key={header.accessor} className="product-field-group">
            <p className="field-name">{header.Header}</p>
            <div className="child-fields">
              {renderFields(product, header.children)}
            </div>
          </div>
        );
      }

    
      const value = getValue(product, header.accessor);
      return (
        <div key={header.accessor} className="product-field">
          <p className="field-name">{header.Header}</p>
          <p className="field-value">{value !== undefined ? value : 'N/A'}</p>
        </div>
      );
    });
  };

  return (
    <div className="grid-list-group">
      {data.map((product, index) => (
        <div className="grid-item" key={index}>
          <p className="product-title">{product.product_name}</p>

          <div className="product-image-container">
            <img
              src={`${product.image_path}`}
              alt={product.name}
              className="product-image"
            />
          </div>

          <div className="product-description">
            {renderFields(product, accessors)}
          </div>
        </div>
      ))}
    </div>
  );
}

function GridView({user_id}){
  const [data,setData] = useState(null);  
  //accessors are data that you want to show beneath the image. May not be all of the entries of the product
  const accessors= 
  [
    {
      Header:"Product Serial",
      accessor:"product_id"
    },
    {
      Header:"Product Name",
      accessor:"product_name"
    },
    {
      Header:"Product Price", 
      accessor:"product_price"
    }, 
    {
      Header:"Product Quantity",
      accessor:"quantity"
    },
    {
      Header: "Product Description",
      accessor: "product_description.description"
    },
    {
      Header: "Date Purchased",
      accessor: "ownership_date"
    }
  ] 
  
  useEffect(()=>{
   fetch(`/api/getAllProducts/${user_id}`,
    {
      method: 'GET'
    }  
   ) 
   .then((response)=>{
    return response.json() 
   })
   .then((data)=>{
    setData(data) 
   })
  },[user_id])    
  
  if(data===null){
   return <div>Loading...</div>
  } 
  return(
    <div style={{maxHeight: "400px",overflowY:"scroll"}}>  
      <ProductGridView data={data} accessors={accessors}/> 
    </div>
  )
}
export default GridView; 