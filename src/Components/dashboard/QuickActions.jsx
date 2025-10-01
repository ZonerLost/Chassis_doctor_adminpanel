import React from "react";
import { MdUploadFile } from "react-icons/md";
import ActionBtn from "./ActionBtn";

const YourComponent = () => {
  return (
    <div>
      {/* ...existing code... */}
      <ActionBtn to="/courses/new" Icon={MdUploadFile} label="Upload Coaching" />
      {/* ...existing code... */}
    </div>
  );
};

export default YourComponent;