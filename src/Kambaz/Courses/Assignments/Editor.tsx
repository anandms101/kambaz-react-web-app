export default function AssignmentEditor() {
    return (
      <div id="wd-assignments-editor">
        <label htmlFor="wd-name">Assignment Name</label>
        <input id="wd-name" value="A1 - INTRO + HTML" /><br /><br />
        <textarea id="wd-description">
          Build a React.js user interface and format it using HTML. Submit a link to your landing page.
        </textarea>
        <br />
        <table>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" value={100} />
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
          <label  htmlFor="wd-group"> Assignment Group</label></td>
 <select id="wd-select-one-assignment">
    <option value="ASSIGNMENT">ASSIGNMENT</option>
    <option value="ASSIGNMENT2">ASSIGNMENT2</option>
    </select>  
          </tr>  
          <tr>
            <td align="right" valign="top">
          <label  htmlFor="wd-group"> Display Grade As</label></td>
 <select id="wd-select-one-assignment">
    <option value="Percentage">Percentage</option>
    <option value="Decimals">Decimals</option>
    <option value="Letters">Letters</option>
    </select>  
          </tr>  
          <tr>
            <td align="right" valign="top">
          <label  htmlFor="wd-group"> Submission Type</label></td>
 <select id="wd-select-one-assignment">
    <option value="Online">Online</option>
    <option value="InPerson">InPerson</option>
    </select>  
          </tr>  
          <tr>
            <td align="right" valign="top">
          <label  htmlFor="wd-group"> Online Entry Options</label></td>
          <input type="checkbox" name="check-entry-option" id="wd-text-entry"/>
          <label htmlFor="wd-text-entry">Text Entry</label><br/>
          <input type="checkbox" name="check-entry-option" id="wd-website-url"/>
          <label htmlFor="wd-website-url">Website URL</label><br/>
          <input type="checkbox" name="check-entry-option" id="wd-media-recordings"/>
          <label htmlFor="wd-media-recordings">Media Recordings</label><br/>
          <input type="checkbox" name="check-entry-option" id="wd-media-recordings"/>
          <label htmlFor="wd-media-recordings">Media Recordings</label><br/>
          <input type="checkbox" name="check-entry-option" id="wd-student-annotation"/>
          <label htmlFor="wd-student-annotation">Student Annotation</label><br/>
          <input type="checkbox" name="check-entry-option" id="wd-file-uploads"/>
          <label htmlFor="wd-file-uploads">File Uploads</label><br/>
          </tr>  
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-assign-to">Assign to</label>
            </td>
            <td>
              <input id="wd-assign-to" title="Everyone" />
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-due">Due</label>
            </td>
            <td>
              <input id="wd-due" type="date" value="2025-07-08"/>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-available-from">Available from</label>
            </td>
            <td>
              <input id="wd-available-from" type="date" value="2024-05-06"/>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-until">Until</label>
            </td>
            <td>
              <input id="wd-until" type="date" value="2024-05-20"/>
            </td>
          </tr>
          <td>
            <button type="button" id="wb-cancel">
            Cancel
            </button>
            <button type="button" id="wb-save">
            Save
            </button>
            
          </td>
        </table>
      </div>
  );}
  



  