import React from 'react';
import ReactDOM from 'react-dom/client';   
import session from './session';     
import ProductTable from './ProductView'
import {useNavigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './productForms.css'   
import './grid.css' 
import './forms.css' 
import './index.css' 
import './list.css' 
import GridView from './List';
import { Typography,Button } from '@mui/material';

import {useState } from 'react';
import Modal from 'react-bootstrap/Modal'; // Import Bootstrap Modal
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// AddProductForm Component (Modal Form) 
var categoryList= ["TV","Refrigerator","Monitor","Phone","Books","Bags"]
var brandList= ["Samsung","LG","Acer"]  
function UpdateForm(){
  const handleUpdate= async(event)=>{
    event.preventDefault(); 
    const formDat = new FormData(event.target); 
    formDat.append('user_id',session.id); 
    console.log(Object.fromEntries(formDat)) 
    fetch('/api/updateProduct',
      {
        method: 'POST',
        body:formDat
      }
    )
    .then((response)=>{
      return response.json(); 
    })
    .then((status)=>{
      console.log(status);
    })
    .catch((err)=>{
      console.log(err); 
    })
 }  
 const handleInputChange = (event)=>{
   const root= ReactDOM.createRoot(document.getElementById("inputText")); 
   if(event.target.value==="product_description"){
    root.render(
    <div className="form-group row">
     <label>New Value</label>
     <input name="new_value" type="text" className="form-control form-control-lg"/>
    </div>
   )
   } 
   else if(event.target.value==="ownership_date"){
     root.render( 
     
     <div className="form-group row">
      <label>New Value</label>
      <input name="new_value" type="date" className="form-control"/>
     </div>
    )
   }
   else if(event.target.value==="product_price"){
     root.render(
     <div className="form-group row"> 
      <label htmlFor="new_value">New Value</label>
      <input name="new_value" type="number" step="0.01" className="form-control"/>
     </div>
     )
   }
   else if(event.target.value==="image_path"){
     root.render(
       <div className="form-group mb-3 row"> 
        <label htmlFor="new_value" className="form-label">
         New Value: 
         <input name="new_value" type="file" className="form-control"/>
       </label>
       </div>
     )
   }
   else{
     root.render(
     <div className="mb-3 form-group row"> 
      <label htmlFor="new_value">New Value</label>
      <input name="new_value" type="text" className="form-control col-xs-1"/>
     </div>
     )
   }
 }
  return(
    <form className="form-group" enctype="multipart/form-data" onSubmit={handleUpdate}> 
        <div className="mb-3 form-group row">
          <label htmlFor="product_serial" className="form-label"> 
            Product Serial:  
            <input className="form-control" name="product_id" type="text"/>
          </label>
        </div>
        <div className="mb-3 form-group row">
          <label htmlFor="properties" className="form-label">What do you want to update?</label>  
          <select onChange={handleInputChange} name="product_prop" className="form-label">
            <option value=""></option>
            <option value="product_name">Product Name</option>
            <option value="product_price">Product Price</option> 
            <option value="ownership_date">Product Ownership Date</option> 
            <option value="brand">Product Brand</option> 
            <option value="product_description">Product Description</option> 
            <option value="image_path">Product Image</option>
          </select>  
          <div id="inputText" className="mb-3 form-group row"></div>
        </div> 
        <Button type="submit">Update Product</Button>
  </form> 
  )
}
function UpdateProductForm({show,handleClose}){ 

 return(
  <Modal show={show} onHide={handleClose} onSubmit={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>
        Update A Product 
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
       <UpdateForm/> 
    </Modal.Body>
    
  </Modal>
 )
}
function isNewCategory(category){
 if(categoryList.includes(category)){
  return true; 
 }
 return false; 
}
function AddForm(){
  const handleAdd = async (event) => {
    event.preventDefault(); 
    const category= document.getElementById("category").value; 

    if(isNewCategory(category)){
      categoryList.push(category);  
    } 
    
    const formDat = new FormData(event.target);
    formDat.append('user_id',session.id);  
    try {
      const response = await fetch('/api/addProduct', {
        method: 'POST',
        body: formDat
      });

      const resp = await response.json(); 
      event.target.reset();    
      console.log(resp);
    } catch (err) {
      console.log('There is an error with the add request.');
    }
  };
  return(
  <form onSubmit={handleAdd} className="form-group" enctype="multipart/form-data">
          <div className="mb-3 d-flex">
            <label>Product Serial:</label>
            <input
              className="form-control"
              type="text"
              name="product_id"
              required
            />
          </div>
          <div className="mb-3 d-flex">
            <label>Product Name:</label>
            <input
              className="form-control"
              type="text"
              name="name"
              required
            />
          </div> 
          <div className="mb-3 d-flex">
            <label>Product Brand:</label> 
            <input className="form-control" type="text" name="brand" required/>
          </div>
          <div className="mb-3 d-flex">
            <label>Product Category:</label>
            <input className="form-control" id="category" type="text" name="product_type" />
          </div>
          <div className="mb-3 d-flex">
            <label>Product Price:</label>
            <input
              className="form-control"
              type="number"
              name="price"
              min="0"
              max="999999"
            />
          </div>
          <div className="mb-3 d-flex">
            <label>Product Quantity:</label>
            <input
              className="form-control"
              type="number"
              name="quantity"
              min="0"
              max="9999999"
            />
          </div>
          <div className="mb-3 d-flex">
            <label>Product Ownership Date:</label>
            <input className="form-control" type="date" name="ownership_date" />
          </div> 
          <div className="mb-3 d-flex">
            <label>Product Description: </label>  
            <br/>
            <input
              type="text" 
              name="product_description"
              id="exampleInput"
              class="form-control" />
          </div>
          <div className="mb-3 d-flex">
            <label>Product Image: </label> 
            <br/> 
            <input className="form-control form-control-lg" id="inputImage" type="file" name="product_image"/>
          </div>
          <Button type="submit">Add Product</Button>
        </form>
 )
} 



function AddProductForm({ show, handleClose }) { 
  

  return (
    <Modal show={show} onHide={handleClose} onSubmit={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header> 
      <Modal.Body>
        <AddForm/> 
      </Modal.Body>
    </Modal>
  );
}


function ProductForm() { 
  
  document.getElementsByTagName('body')[0].style.backgroundImage='none';
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);  
  
  
  const handleShowUpdate = () => setShowUpdateModal(true);  
  const handleCloseUpdate = () => setShowUpdateModal(false);  

  const [filteredData, setFilteredData] = useState([])

  const handleShowAdd = () => setShowAddModal(true); 
  const handleCloseAdd = () => setShowAddModal(false); 
  
  const handleSearch = function(){
    //search something 
  }
 
  
  const navigate= useNavigate();  

  const handleLogOut = ()=>{ 
    session.id=null;  
    navigate("/"); 
  }
  
  return(
    <div className="grid-container">
    <div id="topBar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px', backgroundColor: '#333', color: 'white', height: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/assets/companylogo.png"
            alt="companylogo"
            style={{ width: '50px', height: '50px', marginRight: '10px' }}
            className="rounded-circle"
          />
          <Typography variant="h6" style={{ color: 'white' }}>
            Top Company Bhd
          </Typography>
        </div>
        <Button
          onClick={handleLogOut}
          sx={{
            color: 'white',
          }}
        >
          Log out
        </Button>
   </div>

    <div id="sidebar"> 
     <div id="sidebar">
       <p className="title">Filter By</p>
       <p className="title" style={{borderBottom:"2px solid black"}}>Categories</p>  
       <ul className="list-group" > 
        {
          categoryList.map(function(category){
            return(
               <li className="list-group-item category-list-items ">
                 {category}    
                 <input type="checkbox"/> 
               </li>
            )
          })
        }
       </ul> 
       <p className="title">Brands</p>  
       <ul className="list-group">
        {
          brandList.map(function(brand){
            return(
              <li className="list-group-item category-list-items">
                {brand} 
                <input type="checkbox"/> 
              </li>
            )
          })
        }
       </ul> 
       <p className="title">Price</p>  
       <label htmlFor="priceStart">
        Starting Price: 
        <input type="number" name="priceStart" className="form-control col-xs-small" />  
       </label>
       <label htmlFor="priceStart">
        Ending price: 
        <input type="number" name="priceEnd" className="form-control col-xs-small"/>
       </label>
     </div>
     
    </div>
      <div id="workspace">
          <Typography variant="h4">My Workspace</Typography>
          <div style={{ alignItems: 'center' }}>
            <Button color="primary" onClick={handleShowAdd}>
              Add Product
            </Button>
            <Button color="primary" onClick={handleShowUpdate}>Update Product</Button> 

          </div> 
           <p className="title">Results</p>
          <div>
          <GridView user_id ={session.id}/> 
          </div> 
          <UpdateProductForm show={showUpdateModal} handleClose={handleCloseUpdate}/>
          <AddProductForm show={showAddModal} handleClose={handleCloseAdd} />
        </div>
  </div>
  )
}

export default ProductForm;
