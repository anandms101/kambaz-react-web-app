import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);

  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };

  const deleteElement = (index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };

  return (
    <div id="wd-array-state-variables" className="mt-4 ms-3" style={{ maxWidth: "300px" }}>
      <h2>Array State Variable</h2>
      <button onClick={addElement} className="btn btn-success w-50 mb-3">
        Add Element
      </button>
      <ul className="list-group">
        {array.map((item, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between"
          >
            <span>{item}</span>
            <button
              onClick={() => deleteElement(index)}
              id="wd-delete-element-click"
              className="btn btn-danger"
              style={{ width: "80px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
     
    </div>
  );
}
