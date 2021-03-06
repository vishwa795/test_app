import * as ActionTypes from './ActionTypes.js';
import {baseUrl} from '../shared/baseUrl';
export const addComment = (comment) => ({
    type : ActionTypes.ADD_COMMENT,
    payload : comment
})


// redux thunk middlewares for posting feedback to server.
export const fetchUser = (token) => (dispatch) => {
    dispatch(userLoading());
    fetch(baseUrl+"users/checkJWTtoken", {
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"bearer "+token
        },
        credentials:"same-origin"
    })
    .then(response =>{
        if(response.ok){
            return response;
        }
        else{
            var error = new Error("Error: "+response.status+" "+response.statusText);
            error.response = response;
            throw error;
        }
    },error =>{
        var err = new Error(error.message);
        throw err; 
    })
    .then(res=>res.json())
    .then(response =>{
        if(response.success){
            dispatch(addUser(response));
        }
        else{
            var err = new Error(response.status);
            err.statusCode = response.statusCode;
            throw err;
        }
    }, error =>{
        var err = new Error("Error "+error.message);
        throw err;
    })
    .catch(error =>{
        localStorage.removeItem("token");
        dispatch(userFailed(error.message));
    })
}



export const fbLogin = (accessToken)=> (dispatch) => {
    dispatch(userLoading());
    //console.log("AccessToken is ",accessToken);
    fetch(baseUrl+"users/facebook/token", {
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+accessToken
        },
        credentials:"same-origin"
    })
    .then(response =>{
        if(response.ok){
            return response;
        }
        else{
            var error = new Error("Error: "+response.status+" "+response.statusText);
            error.response = response;
            throw error;
        }
    },error =>{
        var err = new Error(error.message);
        throw err; 
    })
    .then(res=>res.json())
    .then(response =>{
        if(response.success){
            localStorage.setItem("token",response.token);
            dispatch(addUser(response));
        }
        else{
            var err = new Error(response.status);
            err.statusCode = response.statusCode;
            throw err;
        }
    }, error =>{
        var err = new Error("Error "+error.message);
        throw err;
    })
    .catch(error =>{
        dispatch(userFailed(error.message));
    })

}

export const loginUser = (username, password) => (dispatch) =>{
    dispatch(userLoading());
    let user = {
        username: username,
        password: password
    }
    fetch(baseUrl+"users/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(user),
        credentials:"same-origin"
    })
    .then(response =>{
        if(response.ok){
            return response;
        }
        else{
            var err = new Error("Error: "+response.status+" "+response.statusText);
            err.response = response;
            throw err;
        }
    })
    .then(response => response.json())
    .then(response =>{
        if(response.success){
            localStorage.setItem("token",response.token);
            dispatch(addUser(response));
        }
        else{
            var err = new Error(response.status);
            err.statusCode = response.statusCode;
            throw err;
        }
    }, error =>{
        var err = new Error(error.message);
        throw err;
    })
    .catch(error => dispatch(userFailed(error)))
}


export const postComment = (dishId, rating, author, comment) => (dispatch) => {
    const newComment = {
        dishId : dishId,
        rating : rating,
        author: author,
        comment: comment
    }
    newComment.date = new Date().toISOString();

    fetch(baseUrl +"comments" , {
        method:"POST",
        body: JSON.stringify(newComment),
        headers: {
            "Content-Type" : "application/json"
        },
        credentials:"same-origin"

    })
    .then(response => {
        if(response.ok){
            return response;
        }
        else{
            var error = new Error("Error "+response.status+" : "+response.statusText);
            error.response = response;
            throw error;
        }
    }, 
    error => {
        var errMess = new Error(error.message);
        throw errMess;
    })
    .then(response => response.json())
    .then(response => dispatch(addComment(response)))
    .catch(error => {
        console.log("Error occured : "+error.message);
        alert("Your comment could not be posted becuase of \n Error: " +error.message);
    })
}

export const postFeedback = (firstname,lastname,telnum,email,agree,contactType,message) => (dispatch) => {
    const newFeedback = {
        firstname : firstname,
        lastname : lastname,
        telnum: telnum,
        email: email,
        agree: agree,
        contactType:contactType,
        message: message
    }
    newFeedback.date = new Date().toISOString();
    
    fetch(baseUrl + 'feedback', {
        method:"POST",
        body:JSON.stringify(newFeedback),
        headers : {
            "Content-Type" : "application/json"
        },
        credentials:"same-origin"

    })
    .then(response => {
        if(response.ok){
            return response;
        }
        else{
            var error = new Error("Error: "+response.status+" : "+response.statusText);
            error.response = response;
            throw error;
        }
    }, error => {
        var errMess = new Error(error.message);
        throw errMess;
    })
    .then(response => response.json())
    .then(feedback => {
        alert("Thank you for your feedback\n"+JSON.stringify(feedback));
    })
    .catch(error => alert(error.message))
}


export const fetchDishes = () => (dispatch) => {
    dispatch(dishesLoading());
    fetch(baseUrl +"dishes")
        .then(response => {
            if(response.ok){
                return response;
            }
            else{
                var error = new Error("Error "+response.status+" : "+response.statusText);
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errMess = new Error(error.message);
            throw errMess;
        })
        .then(response => response.json())
        .then(dishes => dispatch(addDishes(dishes)))
        .catch(error => dispatch(dishesFailed(error.message)))
}

export const userLoading = () =>({
    type:ActionTypes.USER_LOADING
});

export const addUser = (User) =>({
    type:ActionTypes.USER_LOGIN_SUCCESS,
    payload:User
});

export const userFailed = (response) =>({
    type:ActionTypes.USER_LOGIN_FAILED,
    payload:response
});

export const dishesLoading = () =>({
    type: ActionTypes.DISHES_LOADING
})
export const addDishes = (dishes)=>({
    type: ActionTypes.ADD_DISHES,
    payload: dishes

})
export const dishesFailed = (errmess)=>({
    type : ActionTypes.DISHES_FAILED,
    payload : errmess
})

export const fetchComments = () => (dispatch) => {
    fetch(baseUrl +"comments")
        .then(response => {
            if(response.ok){
                return response;
            }
            else{
                var error = new Error("Error "+response.status+" : "+response.statusText);
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errMess = new Error(error.message+" URL");
            throw errMess;
        })
        .then(response => response.json())
        .then(comments => dispatch(addComments(comments)))
        .catch(error => dispatch(commentsFailed(error.message)))
}

export const addComments = (comments)=>({
    type: ActionTypes.ADD_COMMENTS,
    payload: comments

})
export const commentsFailed = (errmess)=>({
    type : ActionTypes.COMMENTS_FAILED,
    payload : errmess
})

export const fetchPromos = () => (dispatch) => {
    dispatch(promosLoading());
    fetch(baseUrl +"promotions")
        .then(response => {
            if(response.ok){
                return response;
            }
            else{
                var error = new Error("Error "+response.status+" : "+response.statusText);
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errMess = new Error(error.message);
            throw errMess;
        })
        .then(response => response.json())
        .then(promos => dispatch(addPromos(promos)))
        .catch(error => dispatch(promosFailed(error.message)))
}
export const promosLoading = () =>({
    type: ActionTypes.PROMOS_LOADING
})
export const addPromos = (promos)=>({
    type: ActionTypes.ADD_PROMOS,
    payload: promos

})
export const promosFailed = (errmess)=>({
    type : ActionTypes.PROMOS_FAILED,
    payload : errmess
})

export const fetchLeaders = () => (dispatch) => {
    dispatch(leadersLoading());
    fetch(baseUrl +"leaders")
        .then(response => {
            if(response.ok){
                return response;
            }
            else{
                var error = new Error("Error "+response.status+" : "+response.statusText);
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errMess = new Error(error.message);
            throw errMess;
        })
        .then(response => response.json())
        .then(leaders => dispatch(addLeaders(leaders)))
        .catch(error => dispatch(leadersFailed(error.message)))
}
export const leadersLoading = () =>({
    type: ActionTypes.LEADERS_LOADING
})
export const addLeaders = (leaders)=>({
    type: ActionTypes.ADD_LEADERS,
    payload: leaders

})
export const leadersFailed = (errmess)=>({
    type : ActionTypes.LEADERS_FAILED,
    payload : errmess
})


