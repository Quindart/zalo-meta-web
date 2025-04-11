import {
  Avatar,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from "@mui/material";
import {
  Account,
  AccountPopoverFooter,
  SignOutButton,
} from "@toolpad/core/Account";

import { grey } from "@mui/material/colors";
import ProfileDialog  from "./DialogUpdateUser"
import { useState } from "react";
import useAuth from "@/hook/api/useAuth";

function SidebarFooterAccountPopover({
    onOpenProfile
  }: {
    onOpenProfile: () => void;
  }) {
  const {me} = useAuth()
  const accounts = [
    {
      id: 1,
      name: me.lastName + " " + me.firstName,
      email: me.phone,
      image: me.avatar,
      color: "primary.main",
      birthday: me.birthday,
      projects: [
        {
          id: 3,
          title: "Project X",
        },
      ],
    },
  ];
  
  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>
        {accounts[0].name}
      </Typography>
      <MenuList>
        {accounts.map((account) => (
          <MenuItem
            key={account.id}
            component="button"
            sx={{
              justifyContent: "flex-start",
              width: "100%",
              columnGap: 2,
            }}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  fontSize: "0.95rem",
                  bgcolor: account.color,
                }}
                src={account.image ?? ""}
                alt={account.name ?? ""}
              >
                {account.name[0]}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
              }}
              primary={account.name}
              secondary={account.email}
            />
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <AccountPopoverFooter>
        <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontSize: 13,
              marginRight: 10,
              borderColor: grey[500],
              color: grey[900]
            }}
            onClick={() => {
              onOpenProfile();
            }}
          >
            Xem hồ sơ
          </Button>
          <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}

function SidebarFooterAccount() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Account
      slots={{
        popoverContent: () => (
          <SidebarFooterAccountPopover 
          onOpenProfile={() => setOpen(true)} 
          />
        ),
      }}
        slotProps={{
          popover: {
            transformOrigin: { horizontal: "left", vertical: "bottom" },
            anchorOrigin: { horizontal: "right", vertical: "bottom" },
            disableAutoFocus: true,
            slotProps: {
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: (theme) =>
                    `drop-shadow(0px 2px 8px ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.32)"})`,
                  mt: 1,
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    bottom: 10,
                    left: 0,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translate(-50%, -50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            },
          },
        }}
      />
      <ProfileDialog open={open} onClose={() => setOpen(false)}/>
    </>
  );
}
export default SidebarFooterAccount;
