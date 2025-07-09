export default function Modules() {
    return (
      <div>
        <button>Collapse All</button>
        <button>View Progress</button>
        <select id="wd-publish">
         <option value="PUBLISHALL">Publish All</option>
         <option value="PUBLISHSONE">Publish One</option>
       </select>

        <button>+ Module</button>
        <ul id="wd-modules">
          <li className="wd-module">
            <div className="wd-title">Week 1 (6/30 - 7/3)</div>
            <ul className="wd-lessons">
              <li className="wd-lesson">
                <span className="wd-title">Lecture 1 (7/1): Intro, Internet, WWW, Set up dev env</span>
                <ul className="wd-content">
                  <li className="wd-content-item">Building React.js user interfaces</li>
                </ul>
              </li>
              <li className="wd-lesson">
                <span className="wd-title">Lecture 2 (7/3): Formatting User Interfaces with HTML</span>
                <ul className="wd-content">
                  <li className="wd-content-item">Deploying React.js to a remote server</li>
                </ul>
              </li>
              <li className="wd-lesson">
                <span className="wd-title">Assignments</span>
                <ul className="wd-content">
                  <li className="wd-content-item">A1 (Due 7/8): INTRO, HTML</li>
                </ul>
              </li>
              <li className="wd-lesson">
                <span className="wd-title">Exams</span>
                <ul className="wd-content">
                  <li className="wd-content-item">Q1: HTML</li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="wd-module">
            <div className="wd-title">Week 2 (7/7 - 7/10)</div>
            <ul className="wd-lessons">
              <li className="wd-lesson">
                <span className="wd-title">Lecture 3 (7/8): Styling User Interfaces with CSS</span>
                <ul className="wd-content">
                  <li className="wd-content-item">Styling color, position, layout, grids</li>
                </ul>
              </li>
              <li className="wd-lesson">
                <span className="wd-title">Lecture 4 (7/10): Implementing Responsive User Interfaces</span>
                <ul className="wd-content">
                  <li className="wd-content-item">Flex, React icons, Box model, Bootstrap/Icons</li>
                </ul>
              </li>
              <li className="wd-lesson">
                <span className="wd-title">Assignments</span>
                <ul className="wd-content">
                  <li className="wd-content-item">A2 (Due 7/15): CSS, Bootstrap & Flex</li>
                </ul>
              </li>
              <li className="wd-lesson">
                <span className="wd-title">Exams</span>
                <ul className="wd-content">
                  <li className="wd-content-item">Q2: CSS</li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="wd-module">
            <div className="wd-title">Week 3 (7/14 - 7/17)</div>
            <ul className="wd-lessons">
              <li className="wd-lesson">
                <span className="wd-title">Lecture 5 (7/15): Programming User Interfaces with JavaScript</span>
                <ul className="wd-content">
                  <li className="wd-content-item">DOM, JSON, Data Types & Structures</li>
                </ul>
              </li>
              <li className="wd-lesson">
                <span className="wd-title">Lecture 6 (7/17): Strings, arrays, objects, functions, React components</span>
                <ul className="wd-content">
                  <li className="wd-content-item">Dynamic content, router navigation</li>
                </ul>
              </li>
              <li className="wd-lesson">
                <span className="wd-title">Assignments</span>
                <ul className="wd-content">
                  <li className="wd-content-item">A3 (Due 7/22): JavaScript & React, Routing</li>
                </ul>
              </li>
              <li className="wd-lesson">
                <span className="wd-title">Exams</span>
                <ul className="wd-content">
                  <li className="wd-content-item">Q3: CSS</li>
                  <li className="wd-content-item">Q4: JS</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
  );}
  