import React, {useState} from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {Todos, TodosProp} from '../interface/TodosProp'
import { createTodo } from '../pages/index'

const TodoForm = () => {
    const [input, setInput] = useState('')
    const queryClient = useQueryClient()
    const mutation = useMutation((data:string)=> {
        return createTodo(data)
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('todos')
        }
    })
    const handleSubmit = (e:any) => {
        e.preventDefault();

        if (!input) {
          return;
        }
     
        mutation.mutate(input)
    
        setInput("");
    }
    
    
  return (
    <form
      className="bg-white w-2/3 mx-auto shadow p-6 rounded-lg"
      onSubmit={e => handleSubmit(e)}
    >
      <header className="text-2xl font-bold text-center">Todo Form</header>

      <TextField
        fullWidth //
        id="add-todo-input"
        label="Add Todo"
        onChange={e => setInput(e.target.value)}
        value={input}
      />

      <Button
        type="submit"
        color="primary"
        variant="contained"
        fullWidth
        disableElevation
        classes={{ root: "mt-4 normal-case" }}
      >
        Submit
      </Button>
    </form>
  )
}

export default TodoForm