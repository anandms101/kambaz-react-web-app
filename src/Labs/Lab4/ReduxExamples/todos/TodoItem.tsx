import { useDispatch, useSelector } from "react-redux";
import { deleteTodo, setTodo, selectTodo } from "./todosReducer";
import { Button, ListGroup } from "react-bootstrap";

export default function TodoItem({
  todo,
}: {
  todo: { id: string; title: string };
}) {
  const dispatch = useDispatch();
  const { selectedTodoId } = useSelector((state: any) => state.todosReducer);
  const isSelected = selectedTodoId === todo.id;
  return (
    <ListGroup.Item 
      key={todo.id} 
      onClick={() => dispatch(selectTodo(todo.id))}
      style={{ 
        cursor: "pointer",
        backgroundColor: isSelected ? "#fff3cd" : ""
      }}
    >
      <Button
        variant="danger"
        className="float-end"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(deleteTodo(todo.id));
        }}
        id="wd-delete-todo-click"
      >
        Delete
      </Button>
      <Button
        variant="primary"
        className="float-end me-2"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setTodo(todo));
        }}
        id="wd-set-todo-click"
      >
        Edit
      </Button>
      <span className={isSelected ? "fw-bold" : ""}>
        {todo.title}
      </span>
    </ListGroup.Item>
  );
}
