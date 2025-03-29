import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "./api.js";
function UserList(){
    const navigate=useNavigate();
    const [error,setError]=useState('');
    const [message,setMessage]=useState('');
    const [user,setUser]=useState([]);
    const [page,setPage]=useState(1);
    const [loading,setLoading]=useState(true);
    const [isNextDisabled,setIsNextDisabled]=useState(false);
    const [search,setSearch]=useState('');
    useEffect(()=>{
        checkToken();
        if(!localStorage.getItem('deletedUsers')){
            localStorage.setItem('deletedUsers',JSON.stringify([]));
        }
        if(!localStorage.getItem('updatedUsers')){
            localStorage.setItem('updatedUsers',JSON.stringify({}));
        }
        if(!localStorage.getItem('nextPageUsers')){
            localStorage.setItem('nextPageUsers',JSON.stringify([]));
        }
        if(!localStorage.getItem('allUsers')){
            localStorage.setItem('allUsers',JSON.stringify([]));
        }
        getUsersDetails();
    },[page]);
    async function getUsersDetails(){
        try{
            const userDetail=await API.get(`/api/users?page=${page}`);
            let users=userDetail.data?.data;
            console.log(users);
            const nextPageUsers=JSON.parse(localStorage.getItem('nextPageUsers')) || [];
            const deleteUsers=JSON.parse(localStorage.getItem('deletedUsers')) || [];
            const updateUsers=JSON.parse(localStorage.getItem('updatedUsers')) || {};
            let allUsers=JSON.parse(localStorage.getItem('allUsers')) || [];
            if (allUsers.length===0){
                const page2Users=await API.get(`/api/users?page=2`);
                allUsers=[...users,...page2Users.data?.data];
                localStorage.setItem('allUsers',JSON.stringify(allUsers));
            }
            if(page===2){
                users=users.filter(user=>!nextPageUsers.includes(user.id));
            }else{
                const extra=nextPageUsers.map(id=>updateUsers[id] || allUsers.find(user=>user.id===id)).filter(user=>user);
                users=[...users,...extra];   
            }
            users=users.filter(user=>!deleteUsers.includes(user.id));
            users=users.map((user)=>updateUsers[user.id]?updateUsers[user.id]:user);
            setUser(users);
        }catch(err){
            setError('Cannot fetch users detail' || err.message);
            console.log(err);
        }finally{
            setLoading(false);
        }
    }
    async function deleteUser(id){
        checkToken();
        try{
            if(window.confirm("Are you sure you want to delete this user.")){
                const userDeleted=await API.delete(`/api/users/${id}`);
                let updatedUsers=user.filter(u=>u.id!==id);
                setUser(updatedUsers);
                let deletedUsers=JSON.parse(localStorage.getItem('deletedUsers'));
                deletedUsers.push(id);
                localStorage.setItem('deletedUsers',JSON.stringify(deletedUsers));
                let allUsers=JSON.parse(localStorage.getItem('allUsers'))||[];
                allUsers=allUsers.filter(u=>u.id!==id);
                localStorage.setItem('allUsers',JSON.stringify(allUsers));
                setMessage('User Deleted Successfully');
                if(updatedUsers.length===0 && page>1){
                    setPage(page-1);
                    setIsNextDisabled(true);
                }else if(updatedUsers.length<6 && page===1){
                    const nextPageDetails=await API.get(`/api/users?page=${page+1}`);
                    let nextPageUsers=nextPageDetails.data.data;
                    const deleteUsers=JSON.parse(localStorage.getItem('deletedUsers'))||[];
                    const updateUsers=JSON.parse(localStorage.getItem('updatedUsers'))||{};
                    nextPageUsers=nextPageUsers.filter(user=>!deleteUsers.includes(user.id));
                    nextPageUsers=nextPageUsers.map(user=>updateUsers[user.id]?updateUsers[user.id]:user);
                    if(nextPageUsers.length>0){
                        let newNextPageUsers=JSON.parse(localStorage.getItem('nextPageUsers')) || [];
                        newNextPageUsers=[...new Set(newNextPageUsers)];
                        let index=0;
                        while(index<nextPageUsers.length && newNextPageUsers.includes(nextPageUsers[index].id)){
                            index++;
                        }
                        if(index<nextPageUsers.length){
                            newNextPageUsers.push(nextPageUsers[index].id);
                            setUser([...updatedUsers, nextPageUsers[index]]);
                        }
                        localStorage.setItem('nextPageUsers',JSON.stringify(newNextPageUsers));
                    }
                }
                setTimeout(()=>{
                    setMessage('');
                },5000);
            }else{
                setMessage('Operation cancelled');
                setTimeout(()=>{
                    setMessage('');
                },5000);
            }
        }catch(err){
            setError('Something went wrong! please try again' || err.message);
        }
    }
    async function editUser(id){
        checkToken();
        navigate('/editUser',{
            state:{
                id
            }
        });
    }
    function checkToken(){
        const token=localStorage.getItem('token');
        if(!token){
            alert('Either the token is expired or not available');
            navigate('/');
        }
    }
    function searchUser(e){
        const {value}=e.target;
        setSearch(value);
        if(!value){
            getUsersDetails();
        }
        let allUsers=JSON.parse(localStorage.getItem('allUsers')) || [];
        let filteredUsers=allUsers.filter(user=>{
            const fullName=`${user.first_name} ${user.last_name}`.toLowerCase();
            return fullName.includes(value.toLowerCase().trim());
        });
        setUser([...new Map(filteredUsers.map(user=>[user.id,user])).values()]);
    }
    function handlePageChange(page){
        if (search){
            alert("Search has been stopped. Showing normal details.");
            setSearch('');
            getUsersDetails();
        }
        setPage(page);
    }
    function logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('updatedUsers');
        localStorage.removeItem('deletedUsers');
        localStorage.removeItem('allUsers');
        localStorage.removeItem('nextPageUsers');
        navigate('/');
    }
    if(loading){
        return(<p>Loading...</p>)
    }
    return(
        <div className="userContainer">
            <div className="name">
                <h2>EmployWise</h2>
            </div>
            <div>
                {message && <p className="message">{message}</p>}
                {error && <p className="message">{error}</p>}
            </div>
            <div className="input-group">
                <span className="input-group-text">Search</span>
                <input type="text" aria-label="First name" className="form-control" name="name" value={search} onChange={searchUser}/>
                <button onClick={logout}>Logout</button>
            </div>
            {user.length>0?(
                <div className="userList">
                    {user.map((u,index)=>(
                        <div className="card" style={{width:'"18rem'}} key={u.id}>
                            <img src={u.avatar} className="card-img-top" alt="Avatar"/>
                            <div className="card-body">
                                <h5 className="card-title">First Name: {u.first_name}</h5>
                                <h5 className="card-title">Last Name: {u.last_name}</h5>
                            </div>
                            <div className="card-button-body buttonClass">
                                <button className="btn btn-primary" onClick={()=>deleteUser(u.id)}>Delete</button>
                                <button className="btn btn-primary" onClick={()=>editUser(u.id)}>Edit</button>
                            </div>
                        </div>
                    ))}
                </div>
            ):(
                <p>No user information Available on this page.Try changing the page...</p>
            )}
            <div className="paginationButton">
                <button onClick={()=>handlePageChange(page-1)} disabled={page===1}>Previous</button>
                <span>{page}</span>
                <button onClick={()=>handlePageChange(page+1)} disabled={page===2 || isNextDisabled} id="next-button">Next</button>
            </div>
        </div>
    )
}
export default UserList;