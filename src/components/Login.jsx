import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import API from "./api.js";
function Login(){
    const navigate=useNavigate();
    const[email,setEmail]=useState("");
    const[password,setPass]=useState("");
    const[error,setError]=useState("");
    async function userLogin(e){
        e.preventDefault();
        try{
            const response=await API.post("/api/login",{email,password});
            localStorage.setItem('token',response.data.token);
            navigate('/userList');
        }catch(err){
            setError(err.message || 'login failed! Invalid Credentials');
        }
    }
    return(
        <div className="container">
            <div className="name">
                <h2>EmployWise</h2>
            </div>
            <form onSubmit={userLogin} className="form">
                <div className="formComponents">
                    <label>
                        Email:
                    </label>
                    <input type="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                </div>
                <div className="formComponents">
                    <label>
                        Password:
                    </label>
                    <input type="password" name="password" value={password} onChange={(e)=>setPass(e.target.value)} required/>
                </div>
                <div className="formComponents">
                    <label></label>
                    <div className="buttonClass">
                        <button type="submit">Login</button>
                    </div>
                </div>
                <div className="formComponents">
                    <label></label>
                    <div>{error && <p className="message">{error}</p>}</div> 
                </div>
            </form>
        </div>
    )
}
export default Login;