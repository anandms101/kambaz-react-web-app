import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
export default function AssignmentsControlButtons() {
  return (
    <div className="float-end">
      <span className="border border-dark rounded-pill p-2 me-2">
        40% of total
      </span>
      <BsPlus />
      <IoEllipsisVertical className="fs-4" />
    </div>);
}