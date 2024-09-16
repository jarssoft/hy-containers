import React from 'react'

const Todo = ({ todo, doneInfo, notDoneInfo }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
        <span>
        {todo.text} 
        </span>
        {todo.done ? doneInfo : notDoneInfo}
    </div>
  )
}

export default Todo