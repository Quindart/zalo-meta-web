import { APP_ROUTES } from "@/constants";
import { removeValueInLocalStorage } from "@/utils/localStorage";
import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
function DashBoardTemplate() {
  const navigate = useNavigate();
  const logout = () => {
    removeValueInLocalStorage("accessToken");
    navigate(APP_ROUTES.USER.LOGIN_QR);
  };
  const slides = [
    {
      image: "/assets/images/dashboard/mode.png",
      description: "Thư giãn và bảo vệ mắt với giao diện tối mới trên Zalo PC",
      title: "Giao diện Dark Mode",
      titleBtn: "Thử ngay",
    },
    {
      image: "/assets/images/dashboard/quicklyMessage.png",
      description:
        "Sử dụng tin nhắn nhanh để lưu trữ những tin nhắn thường dùng và gửi nhanh trong hộp thoại bất kỳ",
      title: "Nhắn tin nhiều hơn, soạn thảo ít hơn",
      titleBtn: "Thử ngay",
    },
    {
      image: "/assets/images/dashboard/experienceThrough.png",
      description:
        "Kết nối và giải quyết mọi công việc trên mọi thiết bị với dữ liệu luôn được đồng bộ",
      title: "Trải nghiệm xuyên suốt",
      titleBtn: "Thử ngay",
    },
    {
      image: "/assets/images/dashboard/handleFile.png",
      description: `Đã có Zalo PC "xử" hết`,
      title: "Gửi File nặng?",
      titleBtn: "Thử ngay",
    },
  ];

  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Chào mừng đến với Zalo PC!
      </Typography>
      <Typography mb={2}>
        Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân,
        bạn bè được tối ưu hóa cho máy tính của bạn.
      </Typography>
      <Carousel
        animation="slide"
        indicators={true}
        navButtonsAlwaysVisible
        navButtonsProps={{
          style: { color: "#1976d2", backgroundColor: "rgba(0, 0, 0, 0)" },
        }}
        NextIcon={<ArrowForwardIosIcon />}
        PrevIcon={<ArrowBackIosNewIcon />}
      >
        {slides.map((item, index) => (
          <Box key={index} sx={{ p: 3 }}>
            <img
              src={item.image}
              style={{ maxWidth: "60%", height: "300px" }}
            />
            <Typography variant="h5" color="#005ae0" mb={2}>
              {item.title}
            </Typography>
            <Typography mb={2}>{item.description}</Typography>
          </Box>
        ))}
      </Carousel>
    </Container>
  );
}

export default DashBoardTemplate;
