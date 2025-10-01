import {
  MdDashboard,
  MdPeople,
  MdLibraryBooks,
  MdEvent,
  MdLocalOffer,
  MdSupervisedUserCircle,
  MdCampaign,
  MdSettings,
  MdBuild,
} from "react-icons/md";

const menuItems = [
  {
    icon: MdDashboard,
    label: "Dashboard",
    path: "/",
    description: "Overview & Analytics",
    color: "#D4AF37",
  },
  {
    icon: MdPeople,
    label: "Users & Memberships",
    path: "/users-memberships",
    description: "Manage Users",
    color: "#D4AF37",
  },
  {
    icon: MdBuild,
    label: "Chassis Doctor",
    path: "/chassis-doctor",
    description: "Diagnostic System",
    color: "#D4AF37",
  },
  {
    icon: MdLibraryBooks,
    label: "Courses",
    path: "/courses",
    description: "Media Library",
    color: "#D4AF37",
  },
  {
    icon: MdEvent,
    label: "Live & Events",
    path: "/live-events",
    description: "Event Management",
    color: "#D4AF37",
  },
  {
    icon: MdLocalOffer,
    label: "Deals & Partners (PTM)",
    path: "/deals",
    description: "Promotions",
    color: "#D4AF37",
  },
  {
    icon: MdSupervisedUserCircle,
    label: "Supervised Users",
    path: "/supervised-users",
    description: "Manage Supervised Users",
    color: "#D4AF37",
  },
  {
    icon: MdCampaign,
    label: "Campaigns",
    path: "/campaigns",
    description: "Manage Campaigns",
    color: "#D4AF37",
  },
  {
    icon: MdSettings,
    label: "Settings",
    path: "/settings",
    description: "Configuration",
    color: "#D4AF37",
  },
];

export default menuItems;
