import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import API from "./api.js";
function EditUser(){
    const navigate=useNavigate();
    const location=useLocation();
    const [user,setUser]=useState(null);
    const [error,setError]=useState();
    const [message,setMessage]=useState('');
    const [id,setId]=useState();
    const [edit,setEdit]=useState(false);
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        async function getUserDetails(){
            try{
                const id=location.state.id;
                setId(id);
                let updatedUsers=JSON.parse(localStorage.getItem('updatedUsers')) || {};
                if(updatedUsers[id]){
                    setUser(updatedUsers[id]);
                }else{
                    const userDetail=await API.get(`/api/users/${id}`);
                    setUser(userDetail.data.data);
                }
            }catch(err){
                setError('Cannot fetch user details' || err.message);
            }finally{
                setLoading(false);
            }
        }
        getUserDetails();
    },[])
    function updateInformation(e){
        const {name,value}=e.target;
        setUser(prev=>({...prev,[name]:value}));
    }
    async function saveChanges(id){
        try{
            await API.put(`/api/users/${id}`,user);
            setMessage('User details successfully updated! Navigating to homepage');
            setError(null);
            setEdit(true);
            let updateUsers=JSON.parse(localStorage.getItem('updatedUsers')) || {};
            updateUsers[id]=user;
            localStorage.setItem('updatedUsers',JSON.stringify(updateUsers));
            let allUsers=JSON.parse(localStorage.getItem('allUsers')) || [];
            allUsers=allUsers.map(u=>(u.id===id?user:u));
            localStorage.setItem('allUsers',JSON.stringify(allUsers));
            setTimeout(()=>{
                navigate('/userList');
            },5000);
        }catch(err){
            setMessage(null);
            setError(err.message || 'Error while updating the details! please try again');
        }
    }
    if(loading){
        return(<p>Loading...</p>)
    }
    return(
        <div className="editUserContainer">
            <div>
                {message && <p className="message">{message}</p>}
                {error && <p className="message">{error}</p>}
            </div>
            {edit?(
                user &&(
                <div className="card" style={{width:'18 rem'}} key={user.id}>
                    <img src={user.avatar} className="card-img-top" alt="Avatar"/>
                    <div className="card-body">
                        <h5 className="card-title">First Name: {user.first_name}</h5>
                        <h5 className="card-title">Last Name: {user.last_name}</h5>
                    </div>
                </div>
                )
            ):(
                user && (
                <div className="form">
                    <div className="mb-3">
                        <label for="exampleFormControlInput1" className="form-label">First Name</label>
                        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="First Name..." value={user.first_name} name="first_name" onChange={updateInformation}/>
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput1" className="form-label">Last Name</label>
                        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Last Name..." value={user.last_name} name="last_name" onChange={updateInformation}/>
                    </div>
                    <div className="mb-3">
                        <label for="exampleFormControlInput1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" value={user.email} name="email" onChange={updateInformation}/>
                    </div>
                    <div className="mb-3 buttonClass">
                        <button onClick={()=>saveChanges(id)}>Save Changes</button>
                        <button onClick={()=>navigate('/userList')}>Go To Homepage</button>
                    </div>
                </div>
                )
            )}
            
        </div>
    )
}
export default EditUser;