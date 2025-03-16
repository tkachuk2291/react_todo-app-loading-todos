/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import cls from 'classnames';


export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  enum Status  {
      'all'= 'all',
      'active' = 'active',
      'completed' = 'completed'
  }

  enum Errors {
    'titleError' = 'Title should not be empty',
    'addTodoError' = 'Unable to add a todo',
    'updateTodoError' = 'Unable to update a todo',
    'loadTodoError' = 'Unable to load todos'
  }

  const [getTodo , setGetTodo] = useState<Todo[]>( [] )
  const [title, setTitle] = useState('')
  const [hasTitleError ,  SetHasTitleError] = useState(false)
  const [status , setStatus] = useState('all')

  const errorTimerRef = useRef<number | null>(null);

  const resetError = () => {
    // Если таймер уже существует, очищаем его
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = window.setTimeout(() => {
      SetHasTitleError(false);
      errorTimerRef.current = null; // Сбрасываем ref
    }, 3000);
  };


  const reset = () => {
      setTitle('');
  };

  useEffect(() => {
    getTodos().then(setGetTodo)
  }, []);


  const handleTitleChange =
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    }

    const  handleSubmit = (event : React.FormEvent<HTMLFormElement> ) => {
        event.preventDefault()
        if (!title){
          SetHasTitleError(true)
          resetError()
          return
        }

    }


    const filteredTodos = getTodo.filter(todo => {
      if (status === Status.active) {
        return !todo.completed;
      }
      if (status === Status.completed) {
        return todo.completed;
      }
      return true;
    });


  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={handleSubmit}
            onReset={reset}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              value={title}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={handleTitleChange}
            />
          </form>
        </header>

        {filteredTodos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {/*This is a completed todo */}
            {filteredTodos.map(todo => {
              return (


                <div data-cy="Todo" className={cls('todo', { 'completed': todo.completed })}>
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked
                    />
                  </label>

                  <span data-cy="TodoTitle"
                        className="todo__title"
                  >
                {todo.title}
              </span>

                  {/* Remove button appears only on hover */}
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>

                  {/* overlay will cover the todo while it is being deleted or updated */}
                  <div data-cy="TodoLoader" className="modal overlay">
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              )
            })}
          </section>
        )}


        {/* Hide the footer if there are no todos */}


        {getTodo.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            3 items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a

              href="#/"
              className={cls('filter__link', { 'selected': status === Status.all })}
              data-cy="FilterLinkAll"
              onClick={() => {
                setStatus('all')
              }}
            >
              All
            </a>

            <a
              href="#/active"
              className={cls('filter__link', { 'selected': status === Status.active })}
              data-cy="FilterLinkActive"
              onClick={() => {
                setStatus(Status.active)
              }}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={cls('filter__link', { 'selected': status === Status.completed })}
              data-cy="FilterLinkCompleted"
              onClick={() => {
                setStatus(Status.completed)
              }}
            >
              Completed
            </a>
          </nav>
          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
          >
            Clear completed
          </button>
        </footer>
          )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={cls('notification is-danger is-light has-text-weight-normal', { 'hidden': !hasTitleError })}
      >
        <button data-cy="HideErrorButton"
                type="button"
                className="delete"
                onClick={resetError}
        />
        {/*/!* show only one message at a time *!/*/}

        {hasTitleError && (
          <p>{Errors.titleError}</p>
        )}
      </div>


    </div>
  );
};
