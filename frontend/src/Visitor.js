import React, { useState, useEffect } from 'react'
import "./TaskManager.css"
import axios from 'axios';

function Visitor (){
    const [tasks,setTasks] = useState([]);

    useEffect(() => {
      fetchTasks();
    }, []);


      const fetchTasks = async () => {
        try {
          const response = await axios.get('http://localhost:5000/tasks');
          setTasks(response.data.data);
          console.log(JSON.stringify(response.data.data)); 
        } catch (error) {
          console.error('Error fetching products:', error);
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
            <div>
            {task.text } | Határidő: {task.date}
            </div>
          </li>
          )
        ))}
      </ul>
        </div>
        </>
    )

}

export default Visitor