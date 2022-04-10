import { SettingsIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { Link as LinkRouter } from "react-router-dom";

import MenuHeader from "./MenuHeader";

const UserMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Menu isOpen={isOpen} placement="bottom">
      <MenuButton as={IconButton} onClick={onOpen}>
        <SettingsIcon color="GrayText" sx={{ mt: "-5px" }} />
      </MenuButton>
      <MenuList>
        <MenuHeader onClose={onClose}>Account</MenuHeader>
        <MenuDivider />
        <Link
          as={LinkRouter}
          color="black.500"
          fontWeight="bold"
          to="/user/settings"
        >
          <MenuItem>Settings</MenuItem>
        </Link>
        <MenuDivider />
        <Link as={LinkRouter} color="black.500" fontWeight="bold" to="/logout">
          <MenuItem>Log out</MenuItem>
        </Link>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
