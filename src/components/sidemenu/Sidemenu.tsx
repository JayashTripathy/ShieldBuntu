import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../theme-provider";

const networkList = [
  {
    title: "Firewall Configuration",
    link: "/network-security/firewall",
  },
  {
    title: "SSH/IP Blocking",
    link: "/network-security/sshblock",
  },
  {
    title: "USB Blocking",
    link: "/network-security/usbblock",
  },
  {
    title: "TOR Settings",
    link: "/network-security/tor",
  },
  {
    title: "Open Port Management",
    link: "/network-security/port",
  },
];

const bootList = [
  {
    title: "Basic & Display Settings",
    link: "/boot/display",
  },
  {
    title: "Advance Boot SEttings",
    link: "/boot/",
  },
];

const generalList = [
  {
    title: "Firewall Configuration",
    link: "/network-security/firewall",
  },
  {
    title: "SSH/IP Blocking",
    link: "/network-security/sshblock",
  },
];

const Sidemenu = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const sidemenu = document.querySelector(".sidemenu");
    if (theme === "dark") {
      sidemenu?.classList.add("bg-gray-800");
      sidemenu?.classList.remove("bg-gray-300");
    } else {
      document.querySelector(".sidemenu")?.classList.add("bg-gray-300");
      document.querySelector(".sidemenu")?.classList.remove("bg-gray-800");
    }
  }, [theme]);

  return (
    <div className="sidemenu flex flex-col gap-8 items-start w-[350px] h-full overflow-hidden p-8 bg-gray-800">
      <div className="network-security mt-4">
        <h3 className="text-3xl">Network & Security</h3>
        <div className="links flex flex-col ml-4 p-2">
          {networkList.map(({ title, link }) => (
            <Link to={link} className="text-xl text-[#326690] hover:underline">
              {title}
            </Link>
          ))}
        </div>
      </div>
      <div className="network-security mt-4">
        <h3 className="text-3xl">Network & Security</h3>
        <div className="links flex flex-col ml-4 p-2">
          {networkList.map(({ title, link }) => (
            <Link to={link} className="text-xl text-[#326690] hover:underline">
              {title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidemenu;
