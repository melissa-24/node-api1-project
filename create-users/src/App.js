import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const initialValues = {
  name: "",
  bio: ""
}

function App() {

  const [users, setUsers] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = e => {
    e.preventDefault();

    if(values.name && values.bio) {
      if(!isEditing) {
      axios.post("http://localhost:5000/api/users", values)
        .then(res => {
          setUsers([...users, res.data]);
          setValues(initialValues);
        })
        .catch(err => {
          console.log("ml: ", err.response, err.message);
        });
      } else {
        axios.put(`http://localhost:5000/api/users/${values.id}`, values)
          .then(res => {
            setUsers(users.map(user => {
              if(user.id === res.data.id) {
                return res.data;
              }
              return user;
            }));
            setValues(initialValues);
            setIsEditing(false);
          })
          .catch(err => {
            console.log(err.response, err.message);
          });
      }
    }
  }

  const remove = user => {
    axios.delete(`http://localhost:5000/api/users/${user.id}`)
      .then(res => {
        setUsers(users.filter(user => user !== res.data));
        getUsers();
      })
      .catch(err => {
        console.log("ml: ", err.response, err.message);
      });
  }

  const edit = user => {
    setValues(user);
    setIsEditing(true);
  }

  const cancelForm = e => {
    e.preventDefault();

    setValues(initialValues);
    setIsEditing(false);
  }

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    axios.get("http://localhost:5000/api/users")
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.log("ml: ", err.response.data, err.message);
      });
  }

  return (
    <div className="App">
      <nav>
        Create A New User!
      </nav>
      <form onSubmit = {handleSubmit}>
        <label>
          <p>Name:</p>
          <input id = "nameInput" type = "text" name = "name" value = {values.name} onChange = {handleChange} label = "User's Name" />
        </label>
        <label>
          <p>Bio:</p>
          <input id = "bioInput" name = "bio" value = {values.bio} onChange = {handleChange} label = "User's Bio" />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div className = "users">
        <p>To Edit click button under user information will populate above simply edit and click submit</p>
        {users.map(user => {
          return (
            <div key = {user.id} className = "user-card">
              <h3>{user.name}</h3>
              <p>{user.bio}</p>
              <p>{user.id}</p>
              <button onClick = {() => edit(user)}>Edit</button>
              <button onClick = {() => remove(user)}>Delete</button>
            </div>
          );
        })}
      </div>
      <footer>
        Created by Melissa Longenberger
      </footer>
    </div>
  );
}

export default App;
