// Filename - components/SidebarData.js

import React from "react";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import { VscAccount } from "react-icons/vsc";
import { FaChartPie } from "react-icons/fa";
import { VscOutput } from "react-icons/vsc";
import { SiRetool } from "react-icons/si";
import { GrVulnerability } from "react-icons/gr";
export const SidebarData = [
    {
		title: "Dashboard",
		path: "/dashboard",
		icon: <FaChartPie />,
	},
    {
		title: "All Output",
		path: "/allOutput",
		icon: <VscOutput />,
	},
    

];