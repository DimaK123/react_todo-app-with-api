import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  changeAll: boolean;
  deleteTodo: (id: number) => Promise<void>;
  handleChangeCompletedStatus: (
    id: number,
    completed: boolean,
  ) => Promise<void>;
  handleChangeTitle: (id: number, title: string) => Promise<void>;
  // changeStatus: (
  //   id: number,
  //   completed: boolean | null,
  //   title?: string | null,
  // ) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  changeAll,
  deleteTodo,
  handleChangeCompletedStatus,
  handleChangeTitle,
  // changeStatus,
}) => {
  const { id, title, completed } = todo;

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const editForm = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setInputValue(title);
      editForm.current?.focus();
    }
  }, [isEditing, title]);

  const deleteItem = async () => {
    setIsLoading(true);

    try {
      await deleteTodo(id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setInputValue('');
  };

  // const handleCompletedStatus = async () => {
  //   setIsLoading(true);

  //   try {
  //     await changeStatus(id, completed);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleCompletedStatus = async () => {
    setIsLoading(true);

    try {
      await handleChangeCompletedStatus(id, completed);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleChangeTitle = async () => {
  //   if (inputValue !== title) {
  //     try {
  //       setIsLoading(true);
  //       await changeStatus(id, null, inputValue);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   handleCancelEditing();
  // };

  const handleTitleChange = async () => {
    if (!inputValue) {
      deleteItem();

      return;
    }

    if (inputValue !== title) {
      setIsLoading(true);
      try {
        await handleChangeTitle(id, inputValue.trim());
      } finally {
        setIsLoading(false);
      }
    }

    handleCancelEditing();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;

    if (key === 'Escape') {
      handleCancelEditing();
    }
  };

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed })}>
        <label className="todo__status-label">
          <input
            aria-label={`Mark ${title} as ${completed ? 'incomplete' : 'complete'}`}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={handleCompletedStatus}
          />
        </label>

        {isEditing ? (
          <form
            onSubmit={event => {
              event.preventDefault();
              handleTitleChange();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={inputValue}
              ref={editForm}
              onChange={handleInputChange}
              onBlur={handleTitleChange}
              onKeyDown={handleKeyDown}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={deleteItem}
            >
              ×
            </button>
          </>
        )}

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', {
            'is-active': isLoading || (changeAll && completed),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
      {
        // #region Todos in different states
      }
      {/* This todo is an active todo
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          Not Completed Todo
        </span>
        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}

      {/* This todo is being edited
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>
        This form is shown instead of the title and remove button
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}

      {/* This todo is in loadind state
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          Todo is being saved now
        </span>
        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>
        'is-active' class puts this modal on top of the todo
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
      {
        // #endregion
      }
    </>
  );
};
