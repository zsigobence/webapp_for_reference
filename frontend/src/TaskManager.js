import React, { useState, useEffect } from 'react'
import "./TaskManager.css"
import axios from 'axios';

function TaskManager (){
    const [tasks,setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
      date:'',
      text:'',
      completed: false,
      editing: false,
      isToday: true
    });
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [taskData, setTaskData] = useState({
      text:'',
      date:''
    }); 

    useEffect(() => {
      fetchTasks();
    }, []);

      

    const handleAddTask = async () => {
        try {
          await axios.post('http://localhost:5000/tasks', newTask);
          setNewTask({
            date:'',
            text:'',
            completed: false,
            editing: false,
            isToday: true
          });
          setTaskData({
            text:'',
            date:''
          });
          fetchTasks();
        } catch (error) {
          console.error('Error adding task:', error);
        }
      };


      const handleInputChange = (e) => {
        
        const { name, value } = e.target;
        setTaskData({
          ...taskData,
          [name]: value
        })
        setNewTask({
          ...newTask,
          [name]: value
        });
      };

      const fetchTasks = async () => {
        try {
          const response = await axios.get('http://localhost:5000/tasks');
          setTasks(response.data.data);
          console.log(JSON.stringify(response.data.data)); 
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
    
      const handleDeleteTask = async (id) => {
        if (window.confirm(`Biztosan törölni szeretnéd?`)) {
          await axios.post('http://localhost:5000/delete', {taskid: id});   
        }  
          fetchTasks();
      };

      const handleEditTaskChange = (id) => {
        const thisTask = tasks.find((task) => task._id === id);
        setIsAdding(false)
        if(isEditing && !thisTask.editing){
            alert("Fejezd be a jelenlegi módosításaidat!")
        }
        else{
          
        setTasks(
            tasks.map((task) =>
              task._id === id ? { ...task, editing: !task.editing } : task
            )
          );
          setTaskData({text:thisTask.text,
            date:thisTask.date});
        setIsEditing(!isEditing)
        }
      };

      const handleEditTask = async (id) => {
        
          await axios.post('http://localhost:5000/edittask', {taskid: id, text:taskData.text, date:taskData.date});
          setIsEditing(false);
          handleEditTaskChange(id);
          setTaskData({
            text:'',
            date:''
          });
          setNewTask({
            date:'',
            text:'',
            completed: false,
            editing: false,
            isToday: true
          });
          fetchTasks();
      };
    
      
      const handleToggleComplete = async (id) => {
        
        setTasks(
          tasks.map((task) =>
            task._id === id ? { ...task, completed: !task.completed } : task
          )
        );
        try {
          await axios.post('http://localhost:5000/togglecomplete', { taskid: id });
        } catch (error) {
          console.error('Hiba történt a feladat állapotának módosításakor:', error);
        }
        
      };

      const handleCheckboxChange = (event) => {
        if(event.target.checked){
            setTasks(
                tasks.map((task) => 
                  isDateToday(task.date) 
                    ? task
                    : { ...task, isToday: false }
                )
              );
        }else{
            setTasks(
                tasks.map((task) => 
                    ({
                        ...task,
                        isToday: true
                      })
                )
              );
            
        }

      };
      

      function isDateToday(inputDate) {
       
        const [inputYear, inputMonth, inputDay] = inputDate.split('-').map(Number);
        const inputDateObj = new Date(inputYear, inputMonth - 1, inputDay);
        const today = new Date();
        const todayDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
        
        return inputDateObj.getTime() === todayDateObj.getTime();
      }

      const sortTasksByDate = (tasks) => {
        return [...tasks].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;  
        });
      };

      return(
        <>
        <div className='taskManager'>
            <div className='inputs'>
            {!isAdding && (
                <button id='addButton' onClick={() => setIsAdding(true)}>Új feladat hozzáadása</button>
            )}

            {isAdding && (
                    <div className='inputdata'>
                    <input
                        type="date"
                        name="date"
                        value={taskData.date}
                        onChange={handleInputChange}
                    />
                    <textarea
                        name="text"
                        value={taskData.text}
                        onChange={handleInputChange}
                        placeholder="Adj hozzá egy feladatot"
                    />
                    <button onClick={handleAddTask}>Hozzáadás</button>
                    <button onClick={() => setIsAdding(false)}>Mégse</button>
                    </div>
                )}
            </div>
            <p><input
                type="checkbox"
                onChange={handleCheckboxChange}
                />
                Mai határidő
                </p>
            <ul>
        {sortTasksByDate(tasks).map((task) => (
            task.isToday && (
          <li key={task._id} style={{ backgroundColor: task.completed ? 'green' : 'rgba(0,0,0,0)' }}>
            {!task.editing && (<div>
            {task.text } | Határidő: {task.date}
            <div className='taskButtons'>
            <button onClick={() => handleToggleComplete(task._id)}>
              {task.completed ? 'Visszaállítás' : 'Kész'}
            </button>
            <button onClick={() => handleDeleteTask(task._id)}>Törlés</button>
            <button onClick={() => handleEditTaskChange(task._id)}>Módosítás</button></div>
            </div>)}
            
            {task.editing && (<div>
                <input
                        name="date"
                        type="date"
                        value={taskData.date}
                        onChange={handleInputChange}
                    />
                    <textarea
                        name="text"
                        value={taskData.text}
                        onChange={handleInputChange}
                        rows="1" 
                        cols="30" 
                    />
                    <div className='taskButtons'>
                    <button onClick={() =>handleEditTask(task._id)}>Hozzáadás</button>
                    <button onClick={() => handleEditTaskChange(task._id)}>Mégse</button></div>
                </div>)} 
          </li>
          )
        ))}
      </ul>
        </div>
        </>
    )

}

export default TaskManager