import React , { Component } from 'react'
import { Card, CardImg, CardImgOverlay, CardTitle } from 'reactstrap'
function CardRender({dish,onClick}){
return(  <Card onClick={() => onClick(dish.id) }>
    <CardImg width="100%" src={dish.image} alt={dish.name} />
    <CardImgOverlay>
      <CardTitle>{dish.name}</CardTitle>
    </CardImgOverlay>
  </Card>
)
}
  function Menu(props){
    const menu = props.dishes.map((dish)=>{
      return <div key={dish.id} className="col-10 col-md-5 m-1">
              <CardRender dish={dish} onClick={props.onClick} />
              </div>
    });

    return(
      <div className="row">
      {menu}
      </div>
    );
  }
export default Menu;