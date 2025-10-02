import React from "react";
import {
  MdAdd,
  MdFilterAlt,
  MdSort,
  MdSearch,
  MdDownload,
  MdPlayCircleFilled,
  MdArticle,
  MdAudiotrack,
  MdFilePresent,
  MdVisibility,
  MdEdit,
} from "react-icons/md";
import { STATUS_COLORS } from "../../utils/constants";

const COLORS = {
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
};

export default function ContentTable({ data = [] }) {
  // Component logic here...

  return (
    <div>
      {/* Render the data prop as a simple list for demonstration */}
      <ul>
        {data.map((item, idx) => (
          <li key={idx}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}
