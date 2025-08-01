export default function Assignments() {
    return (
      <div id="wd-assignments">
        <input placeholder="Search for Assignments"
               id="wd-search-assignment" />
        <button id="wd-add-assignment-group">+ Group</button>
        <button id="wd-add-assignment">+ Assignment</button>
        <h3 id="wd-assignments-title">
          ASSIGNMENTS 40% of Total <button>+</button> </h3>
        <ul id="wd-assignment-list">
          <li className="wd-assignment-list-item">
            <a href="#/Kambaz/Courses/1234/Assignments/123"
               className="wd-assignment-link" >
              A1 - ENV + HTML
            </a> 
            <div id="wd-p-1">
              Multiple Modules | Not available until July 4 at 12:00am 
              | Due July 8 at 11:59pm | 100pts
            </div>
            </li>
          <li className="wd-assignment-list-item">
          <a href="#/Kambaz/Courses/1234/Assignments/123"
               className="wd-assignment-link" >
              A2 - CSS + BOOTSTRAP
            </a>
            <div id="wd-p-1">
            Multiple Modules | Not available until July 6 at 12:00am | Due July 15 at 11:59pm | 100pts
            </div>
          </li>
          <li className="wd-assignment-list-item">
          <a href="#/Kambaz/Courses/1234/Assignments/123"
               className="wd-assignment-link" >
              A3 - JAVASCRIPT + REACT
            </a>
            <div id="wd-p-1">
            Multiple Modules | Not available until July 10 at 12:00am | Due July 22 at 11:59pm | 100pts
            </div>
          </li>
        </ul>
      </div>
  );}
  