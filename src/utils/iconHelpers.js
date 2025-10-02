import { DEFAULT_PAGE_SIZES, STATUS_COLORS } from "../../utils/constants";
import { Checkbox, StatusPill, Chip } from "../ui/common/TablePrimitives";
// import { getTypeIcon } from "../../utils/iconHelpers";
import {
  MdPlayCircleFilled,
  MdArticle,
  MdAudiotrack,
  MdFilePresent,
} from "react-icons/md";

export const getTypeIcon = (type, size = 16) => {
  const icons = {
    video: MdPlayCircleFilled,
    article: MdArticle,
    audio: MdAudiotrack,
    download: MdFilePresent,
  };

  const IconComponent = icons[type] || MdFilePresent;
  return <IconComponent size={size} />;
};
