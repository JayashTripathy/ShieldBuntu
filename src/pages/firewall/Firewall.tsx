import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { invoke } from "@tauri-apps/api/tauri";
import { HiOutlineInformationCircle } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { GiSheikahEye } from "react-icons/gi";
import useLoading from "@/hooks/useLoading";
import { useFirewallStore } from "@/store";
import Loader from "@/components/Loader";

const Firewall = () => {
  const { toast } = useToast();
  const updateFirewallStatus = useFirewallStore(
    (state) => state.toggleFirewall
  );
  const firewallStatus = useFirewallStore((state) => state.firewall);
  const { isLoading: isEnablelLoading, execute: executeEnable } = useLoading({
    functionToExecute: () => invoke("apply_firewall_rules"),
    onSuccess: (res) => {
      if (res === "true") {
        console.log("firewall on");
        updateFirewallStatus();
      } else {
        console.log("not able to enable firewall");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Not able to enable/disable firewall.",
        });
      }
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  const { isLoading: isDisablelLoading, execute: executeDisable } = useLoading({
    functionToExecute: () => invoke("reverse_firewall_rules"),
    onSuccess: (res) => {
      if (res === "true") {
        console.log("firewall off");
        updateFirewallStatus();
      } else {
        console.log("not able to disable firewall");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Not able to enable/disable firewall.",
        });
      }
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  const handleSwitchChange = () => {
    if (!firewallStatus) {
      console.log("trying to enable firewall");
      executeEnable();
    } else {
      console.log("reverse_firewall_rules");
      executeDisable();
    }
  };

  return (
    <div className="firewall flex flex-row justify-center mx-auto max-w-[900px] p-8">
      <div className="main-section py-12">
        <div className=" flex gap-2  items-center ">
          <h1 className="text-3xl text-primary font-bold">
            Firewall Configuration{" "}
          </h1>
          <TooltipProvider>
            <Tooltip delayDuration={20}>
              <TooltipTrigger className="">
                {" "}
                <HiOutlineInformationCircle size={25} />
              </TooltipTrigger>
              <TooltipContent>Hover</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="py-2 text-foreground/50 leading-6">
          Control network ports and firewall rules with UFW. Allow/deny specific
          ports, protocols. Use iptables for advanced rules. Install, configure,
          manage. Ensure network security.
        </p>
        <br />
        <div className="toggle-firewall bg-secondary/60 mt-2 p-2 px-4 text-lg border-2 rounded-lg flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <p>Enable/Disable Firewall</p>
            {(isDisablelLoading || isEnablelLoading) && <Loader />}
          </div>
          <Switch
            className=""
            checked={firewallStatus}
            disabled={isDisablelLoading || isEnablelLoading}
            onClick={handleSwitchChange}
          />
        </div>
        <br />

        {/* IP table config */}
        <div className="iptable mt-12">
          <h2 className="text-xl mb-4 font-bold ">IP Table Configuration</h2>
          <Table className="">
            {/* <TableCaption>IP table rules.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg" colSpan={2}>
                  Custom IP table rules
                  <Button className="absolute right-0 top-0">
                    View Current Rules
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Add more rules</TableCell>
                <TableCell className="relative">
                  <Button className="absolute right-0 top-0">ADD</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Firewall;
