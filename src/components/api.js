import axios from "axios";
const API=axios.create({
  baseURL:"https://reqres.in/",
  headers:{
    "Content-Type":"application/json",
  },
});
export default API;
