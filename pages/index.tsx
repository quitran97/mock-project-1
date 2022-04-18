import type { NextPage } from 'next'
import Head from 'next/head'
import TodoForm from '../components/TodoForm'
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@material-ui/core/Button";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import CheckCircleOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import { useQuery, QueryClient, useQueryClient, useMutation } from 'react-query'
import axios from 'axios'
import { TodosProp, Todos } from '../interface/TodosProp'
import { IconButton } from "@material-ui/core";

let todos = [
  { id: 1, body: "Todo 1", isCompleted: false },
  { id: 2, body: "Todo 2", isCompleted: true }
];

export const fetchTodos = () => {
  return Promise.resolve({todos: todos, filterChange: "ALL"});
};

export const createTodo = (body: any) => {
  const newTodo = {
    id: Date.now(),
    body,
    isCompleted: false
  };
  todos.push(newTodo);

  return Promise.resolve(newTodo);
};

export const deleteTodo = (todoIdToDelete: any) => {
  const newTodos = todos.filter((todo) => todo.id !== todoIdToDelete);
  todos = newTodos;
  return Promise.resolve(todoIdToDelete);
};

export const toggleTodo = (todoIdToToggle: any) => {
  const newTodos = todos.map((todo) => {
    if (todo.id === todoIdToToggle) {
      return {
        ...todo,
        isCompleted: !todo.isCompleted
      };
    }
    return todo;
  });

  todos = newTodos;
  return Promise.resolve(todoIdToToggle);
};


const Home: NextPage = () => {
  const queryClient = useQueryClient();
  const {data, isFetching} = useQuery('todos', async() => {
    const res = await fetchTodos()
    if (!res) {
      throw new Error('Invalid Query!')
    }
    return res
  })
  
  
  queryClient.setQueryData('todosList',data);
  const todosData:TodosProp = queryClient.getQueryData('todosList') as TodosProp;


const handleFilterStateChange = (filterState: string) => {
  queryClient.setQueryData('todos', (data:any) => {
    return {
      ...data,
      filterChange: filterState
    }
  })
}

  const useTodosToDisplaySelector = useCallback(() => {
    if (todosData){
      const { filterChange, todos } = todosData;
      let todosToDisplay = todos;
      if (filterChange === "ALL") {
        todosToDisplay = todos;
      } else if (filterChange === "Active") {
        todosToDisplay = todos?.filter(({ isCompleted } : {isCompleted: boolean}) => !isCompleted);
      } else if (filterChange === "Completed") {
        todosToDisplay = todos?.filter(({ isCompleted } : {isCompleted: boolean}) => isCompleted);
      }
      return todosToDisplay
    }
  }, [todosData]);

  const todoDisplay = useTodosToDisplaySelector() 
  const mutationToggle = useMutation((data: number)=>{
    return toggleTodo(data)
  }, {
    onSuccess:() => {
      queryClient.invalidateQueries('todos')
    }
  })

  const handleToggle = (id:number) => {
    mutationToggle.mutate(id)
  }

  const mutationDelete = useMutation((data: number)=>{
    return deleteTodo(data)
  }, {
    onSuccess:() => {
      queryClient.invalidateQueries('todos')
    }
  })

  const handleDelete = useCallback((id:number) => {
    mutationDelete.mutate(id)
  }, [mutationDelete])

  console.log('hello');
  
  

  return (
    <div>
      <Head>
        <title>Mock Project</title>
      </Head>
      <main className="bg-gray-400 min-h-screen">
       <section style={{ width: "500px" }} className="pt-10 mx-auto">
         <TodoForm />
       </section>
       <section style={{ width: "500px" }} className="pt-10 mx-auto">
        <div className="bg-white w-2/3 mx-auto shadow p-6 rounded-lg">
          <header className="text-2xl font-bold text-center">Todo List</header>

          <section className="flex justify-center pt-4">
            <Button
              color="secondary"
              variant={todosData?.filterChange === "ALL" ? "contained" : "outlined"}
              disableElevation
              classes={{ root: "normal-case" }}
              onClick={()=>handleFilterStateChange("ALL")}
            >
              All
            </Button>
            <Button
              color="secondary"
              variant={todosData?.filterChange === "Active" ? "contained" : "outlined"}
              disableElevation
              classes={{ root: "ml-2 normal-case" }}
              onClick={()=>handleFilterStateChange("Active")}
            >
              Active
            </Button>
            <Button
              color="secondary"
              variant={todosData?.filterChange === "Completed" ? "contained" : "outlined"}
              disableElevation
              classes={{ root: "ml-2 normal-case" }}
              onClick={()=>handleFilterStateChange("Completed")}
            >
              Completed
            </Button>
          </section>

          <ul className="pt-4">
            {todoDisplay ? todoDisplay.map(({ id, body, isCompleted } : Todos) => (
              <li key={id} className="flex justify-between">
                <div className="flex items-center">
                  {isCompleted ? (
                    <IconButton
                      classes={{ root: "p-1" }}
                      onClick={()=>handleToggle(id)}
                    >
                      <CheckCircleOutlinedIcon
                        classes={{ root: "fill-current text-green-500" }}
                      />
                    </IconButton>
                  ) : (
                    <IconButton
                      classes={{ root: "p-1" }}
                      onClick={()=>handleToggle(id)}
                    >
                      <RadioButtonUncheckedIcon />
                    </IconButton>
                  )}

                  <p
                    className={`pl-2 ${isCompleted &&
                      "line-through text-gray-600"}`}
                  >
                    {body}
                  </p>
                </div>
                <IconButton
                  classes={{ root: "p-1" }}
                  onClick={()=>handleDelete(id)}
                >
                  <ClearOutlinedIcon
                    classes={{ root: "fill-current text-red-500" }}
                  />
                </IconButton>
              </li>
            )): undefined}
          </ul>
        </div>
      </section>
      </main>
    </div>
  )
}

export default Home