import React from "react"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Avatar,
    Typography,
    Box,
    Button,
    IconButton,
    Divider,
    AvatarGroup,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Link

} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import LinkIcon from "@mui/icons-material/Link";
import { grey } from "@mui/material/colors";

interface InfoGrouplogProps{
    open: boolean;
    onClose: ()=>void;
}

const InfoGroupDialog : React.FC<InfoGrouplogProps>=({open, onClose})=>{
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            sx={{
                "& .MuiDialog-paper":{
                    background: "white",
                    boxShadow: 5,
                    borderRadius:2,
                }
            }}
        >

            {/*Tieu de*/}
            <DialogTitle sx={{display: "flex", justifyContent:"space-between", alignItems: "center", fontSize: 15, fontWeight: "600"}}>
                Thông tin nhóm
                <IconButton onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>

            <Divider/>

            <DialogContent
                sx={{
                    p: 2,
                    maxHeight: "70vh", // Giới hạn chiều cao để xuất hiện thanh cuộn
                    overflowY: "overlay", // Ẩn thanh cuộn khi không cần thiết
                    "&::-webkit-scrollbar": {
                      width: "8px", // Độ rộng của thanh cuộn
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                      visibility: "hidden",
                    },
                    "&:hover::-webkit-scrollbar-thumb": {
                      visibility: "visible"
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)"
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "transparent"
                    },
                  }}
            >

                {/*Anh dai dien */}
                <Box 
                    sx={{display: "flex"}}
                >
                    <Box sx={{m:1, position: "relative"}}>
                        <Avatar
                            src="/assets/images/zalo-icon.png"
                            sx={{ width: 80, height: 80, border: "2px solid #C3C5C8"}}
                        />
                        <IconButton
                            sx={{
                                position: "absolute",
                                bottom:0,
                                right:0,
                                width:26,
                                height:26,
                                zIndex:1,
                                backgroundColor: grey[300]
                            }}
                        >
                            <CameraAltIcon sx={{color: grey[500], fontSize:20}}/>
                        </IconButton>
                    </Box>
                    <Box sx={{display: "flex", alignItems:"center"}}>
                        <Typography variant="h6" sx={{mt:1, fontWeight: "bold"}}>
                            Nhóm 11 💮Công Nghệ Mới
                        </Typography>
                        <IconButton
                            sx={{
                                width:30,
                                height:30,
                                "&:hover":{
                                    backgroundColor: grey[100],
                                },
                                ml:1
                            }}
                        >
                            <EditIcon sx={{color:"#1a2b44", fontSize:20}}/>
                        </IconButton>
                    </Box>
                </Box>
                
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: grey[200],
                        color: "#000",
                        fontSize:15,
                        borderRadius: "5px",
                        padding: "8px 16px",
                        width: "100%",
                        fontWeight: "bold",
                        mb:2,
                        "&:hover":{
                            backgroundColor: grey[400]
                        }
                    }}
                >
                    Nhắn tin
                </Button>
                <Divider sx={{height:8, bgcolor: grey[200], marginRight:-2, marginLeft:-2, borderBottom:0}}/>

                {/**Thanh vien */}
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: "600" }}>
                        Thành viên (5)
                    </Typography>

                    <AvatarGroup max={4} sx={{ justifyContent: "start", mt: 1 }} >
                        {[
                            "/static/avatar1.jpg",
                            "/static/avatar2.jpg",
                            "/static/avatar3.jpg",
                            "/static/avatar4.jpg",
                            "/static/avatar5.jpg",
                            "/static/avatar6.jpg",
                            "/static/avatar7.jpg",
                        ].map((src, index) => (
                            <Avatar key={index} src={src} />
                        ))}
                    </AvatarGroup>
                </Box>
                <Divider sx={{height:8, bgcolor: grey[200], marginRight:-2, marginLeft:-2, borderBottom:0, marginTop:2}}/>

                {/**Hinh anh / video */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "600" }}>
                        Ảnh/Video
                    </Typography>
                    <Box
                        sx={{
                        display: "flex",
                        gap: 1,
                        mt: 1,
                        overflowX: "auto",
                        scrollbarWidth: "none", // Ẩn scrollbar trên Firefox
                        "&::-webkit-scrollbar": {
                            display: "none", // Ẩn scrollbar trên Chrome, Safari
                        },
                        paddingBottom: 1, // Thêm padding để tránh bị che mất hình ảnh
                        }}
                    >
                        {[
                        "/assets/images/dog1.jpg",
                        "/assets/images/dog2.jpg",
                        "/assets/images/dog1.jpg",
                        "/assets/images/dog2.jpg",
                        "/assets/images/zalo-welcom.png",
                        "/assets/images/check_welcom.png",
                        ].map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`Ảnh ${index + 1}`}
                            width="100"
                            height="100"
                            style={{
                            borderRadius: 12,
                            objectFit: "cover",
                            flexShrink: 0, // Tránh co lại khi cuộn
                            }}
                        />
                        ))}
                    </Box>
                </Box>

                <Divider sx={{height:8, bgcolor: grey[200], marginRight:-2, marginLeft:-2, borderBottom:0, marginTop:2}}/>
                
                {/**cac tuy chon khac */}
                <Box>
                    <List>
                        <ListItemButton>
                            <ListItemIcon>
                                <LinkIcon/>
                            </ListItemIcon>
                            <Box sx={{display: "flex", flexDirection: "column", fontSize: 13}}>
                                <ListItemText primary="Link tham gia nhóm"/>
                                <Link href="https://zalo.me/g/xypyq987" target="_blank" underline="hover">
                                    https://zalo.me/g/xypyq987
                                </Link>
                            </Box>
                            <Box sx={{ ml:3 }}>
                                <IconButton sx={{with:40, height: 40, bgcolor: grey[200], mr:2}}>
                                    <ContentCopyIcon sx={{ fontSize:20}}/>
                                </IconButton>
                                <IconButton sx={{with:40, height: 40, bgcolor: grey[200]}}>
                                    <ShareIcon sx={{ fontSize:20}}/>
                                </IconButton>
                            </Box>
                            
                        </ListItemButton>

                        <ListItemButton>
                            <ListItemIcon>
                                <SettingsIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Quản lý nhóm"/>
                        </ListItemButton>

                        <ListItemButton sx={{ color: "red" }}>
                            <ListItemIcon sx={{ color: "red" }}>
                            <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Rời nhóm" />
                        </ListItemButton>
                    </List>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default InfoGroupDialog;