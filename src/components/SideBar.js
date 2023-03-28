import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListItem from "@mui/material/ListItem";

export default function NestedList() {
  const [open, setOpen] = React.useState({
    domain: false,
    learn: false,
    build: false,
  });

  const handleClick = (id) => {
    if (id === "domain") {
      setOpen((pre) => ({ ...pre, domain: !open.domain }));
    } else if (id === "learn") {
      setOpen((pre) => ({ ...pre, learn: !open.learn }));
    } else if (id === "build") {
      setOpen((pre) => ({ ...pre, build: !open.build }));
    } else {
      setOpen({
        domain: false,
        learn: false,
        build: false,
      });
    }
  };

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton onClick={() => handleClick("domain")}>
        <ListItemText primary="Domains" />
        {open.domain ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open.domain} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Domain Search" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Premium Domains" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Refere Friends" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="My Domains" />
          </ListItemButton>
        </List>
      </Collapse>
      <ListItemButton onClick={() => handleClick("learn")}>
        <ListItemText primary="Learn" />
        {open.learn ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open.learn} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Learning Hub" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="About" />
          </ListItemButton>
        </List>
      </Collapse>
      <ListItemButton onClick={() => handleClick("build")}>
        <ListItemText primary="Build" />
        {open.build ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open.build} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Developers" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Discord" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Documentation" />
          </ListItemButton>
        </List>
      </Collapse>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemText primary="Apps" />
        </ListItemButton>
      </ListItem>
    </List>
  );
}
