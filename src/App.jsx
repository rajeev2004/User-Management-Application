import React from 'react';
import {HashRouter as Router,Routes,Route} from 'react-router-dom';
import EditUser from './components/EditUser';
import UserList from './components/UserList';
import Login from './components/Login';
import NotFound from './components/NotFound';
function App(){
    return (
        <Router>
            <div>
                <Routes>
                    <Route exact path="/" element={<Login />}/>
                    <Route exact path="/userList" element={<UserList />}/>
                    <Route exact path="/editUser" element={<EditUser />}/>
                    <Route path="*" element={<NotFound />}/>
                </Routes>
            </div>
        </Router>
    );
}
export default App;
