import React, {Component, useState} from 'react';
import {Card,CardTitle, CardBody, CardImg,CardImgOverlay, CardText, Breadcrumb,Button,Modal,Row,Label, ModalBody,ModalHeader, BreadcrumbItem} from 'reactstrap';
import {Link} from 'react-router-dom';
import {LocalForm, Errors, Control} from 'react-redux-form';
import {Loading} from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl';
import {FadeTransform, Fade, Stagger } from 'react-animation-components';

const minLength = (len) => (val) => val && (val.length >= len);
const maxLength = (len) => (val) => !val || (val.length <= len) ;

class CommentForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      isModalOpen : false,
    }
  }
  toggleModal = ()=> {
    this.setState({
      isModalOpen : !this.state.isModalOpen
    });
  }
  handleSubmit(values){
    this.props.postComment(this.props.dishId, values.rating, values.name, values.comment);
    this.toggleModal();
  }
  render(){
  return(
    <React.Fragment>
      <Button outline onClick={this.toggleModal}>
        <span className="fa fa-md fa-pencil"> Submit Comment </span>
      </Button>
      <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}> Submit Comment </ModalHeader>
        <ModalBody>
          <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
            <Row className="form-group m-2">
            <Label htmlFor="rating"> Rating </Label>
            <Control.select model=".rating" id ="rating" name="rating" className="form-control">
            <option> 1 </option>
            <option> 2 </option>
            <option> 3 </option>
            <option> 4 </option>
            <option> 5 </option>
            </Control.select>
            </Row>
            <Row className="form-group m-2">
            <Label htmlFor="name"> Your Name </Label>
            <Control.text model=".name" id ="name" name="name" validators={{
              minLength: minLength(3),
              maxLength: maxLength(15)
            }} className="form-control"/>
            <Errors show="touched" className="text-danger" model=".name" messages={{
              minLength : "Must be greater than 2 Characters",
              maxLength : "Must be 15 Characters or less"
            }} />
            </Row>
            <Row className="form-group m-2">
            <Label htmlFor="comment"> Comments </Label>
            <Control.textarea model=".comment" rows="6" id ="comment" name="comment" className="form-control"/>
            </Row>
            <Row className="form-group m-2">
              <Button type="submit" value="Submit" color="primary"> Submit </Button>
            </Row>
          </LocalForm>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
  }
}

  function getdate(date){
    const d = new Date(date);
    const month = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];
    return(
      <span>
      { month[d.getMonth()] } {d.getDate()}, {d.getFullYear()}
      </span>
    )
  }
  function RenderDish({dish}){

    const [clicked,clickStatus] = useState(false);

    const toggleLike = () => {
      console.log(clicked);
      clickStatus(!clicked);
    }
    return (
    <div className="col-sm-10 col-md-5 m-1">
      <FadeTransform in 
      transformProps={{
        exitTransform: 'scale(0.5) translateY(-50%)'
      }} >
        <Card>
          <CardImg width="100%" src={baseUrl + dish.image} />
          <CardImgOverlay>
            <Button outline color="dark" onClick={toggleLike}>
              {
                clicked ?
                <span className="fa fa-md fa-heart" />
                :
                <span className="fa fa-md fa-heart-o" />
              }
            </Button>
            </CardImgOverlay>
          <CardBody>
            <CardTitle><h4>{dish.name}</h4></CardTitle>
            <CardText>{dish.description}</CardText>
          </CardBody>
        </Card>
      </FadeTransform>
    </div>)
  }
  function RenderComments({comment}){
    return( 
    <Stagger in>
    {comment.map((c) =>{
    return(
      <Fade in>
        <div>
            <p>{c.comment}
            <br /> 
            -- {c.author} , {getdate(c.date)}
            </p>
        </div>
      </Fade>
       )
      } ) }
  </Stagger> 
   )
  }
  function DishDetailComponent(props){
    console.log(props);
    if(props.isLoading){
      return(
        <div className="container">
          <div className="row">
            <Loading />
          </div>
        </div>
      )
    }
    else if(props.errMess){
      return(
        <div className="container">
          <div className="row">
            <h4> {props.errMess} </h4>
          </div>
        </div>
      )
    }
    else if(props.dish !=null){
      return(
        <div className="container">
          <div className="row">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/home"> Home </Link></BreadcrumbItem>
              <BreadcrumbItem><Link to="/menu"> Menu </Link></BreadcrumbItem>
              <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
            </Breadcrumb>
            <div className="col-12">
              <h3> {props.dish.name} </h3>
              <hr />
            </div>
        </div>
          <div className="row">
            <RenderDish dish={props.dish} />
            <div className="col-sm-10 col-md-5 m-1">
              <h4>Comments</h4>
                <RenderComments comment={props.comment} />
              <CommentForm postComment={props.postComment} dishId={props.dish._id} />
            </div>
          </div>
        </div>
      )
  }
  else{
    return(
      <h1> Nothing found </h1>
    )
  }
  }

export default DishDetailComponent;
