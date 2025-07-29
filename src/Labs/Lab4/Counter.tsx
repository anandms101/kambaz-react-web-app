import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Counter() {
  const [count, setCount] = useState(7);

  return (
    <div className=" mt-4">
      <h2>Counter: {count}</h2>
      <div className="d-flex  gap-3 mt-3">
        <button
          onClick={() => setCount(count + 1)}
          id="wd-counter-up-click"
          className="btn btn-success"
          style={{ width: "80px" }}
        >
          Up
        </button>
        <button
          onClick={() => setCount(count - 1)}
          id="wd-counter-down-click"
          className="btn btn-danger"
          style={{ width: "80px" }}
        >
          Down
        </button>
      </div>
      <hr />
    </div>
  );
}
