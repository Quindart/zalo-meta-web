import * as React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Divider, ListItemIcon } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import LabelIcon from '@mui/icons-material/Label';

const options = [
  { label: 'Ghim hội thoại', itemId: 'pin' },
  { label: 'Phân loại', itemId: 'category', subMenu: true, icon: <ArrowForwardIosIcon sx={{ fontSize: 15 }} /> },
  { label: 'Đánh dấu đã đọc', itemId: 'unread' },
  { label: 'Thêm vào nhóm', itemId: 'add-group' },
  { label: 'Tắt thông báo', itemId: 'mute', subMenu: true, icon: <ArrowForwardIosIcon sx={{ fontSize: 15 }} /> },
  { label: 'Ẩn trò chuyện', itemId: 'hide' },
  { label: 'Tin nhắn tự xóa', itemId: 'auto-delete', subMenu: true, icon: <ArrowForwardIosIcon sx={{ fontSize: 15 }} /> },
  { label: 'Xóa hội thoại', itemId: 'delete' },
  { label: 'Báo xấu', itemId: 'report' },
];

const classifyOptionCategory = [
  { label: "Khách hàng", icon: <LabelIcon sx={{ color: "#D91B1B" }} /> },
  { label: "Gia đình", icon: <LabelIcon sx={{ color: "#F31BC8" }} /> },
  { label: "Công việc", icon: <LabelIcon sx={{ color: "#FF6905" }} /> },
  { label: "Bạn bè", icon: <LabelIcon sx={{ color: "#FAC000" }} /> },
  { label: "Trả lời sau", icon: <LabelIcon sx={{ color: "#4BC377" }} /> },
  { label: "Đồng nghiệp", icon: <LabelIcon sx={{ color: "#0068FF" }} /> },
  { label: "Quản lý thẻ phân loại", divider: true },
];

const classifyOptionAutoDelete = [
  { label: '1 Ngày', },
  { label: '7 Ngày', },
  { label: '14 Ngày', },
  { label: 'Không bao giờ', divider: true },
];

const classifyOptionMute = [
  { label: 'Trong 1 giờ', },
  { label: 'Trong 4 giờ', },
  { label: 'Cho đến 8:00 AM', },
  { label: 'Cho đến khi mở lại', },
];



const SubMenu = ({ listItem }) => {
  return (
    <div className='min-w-60 absolute top-0 -right-[245px] bg-white z-50 shadow-md border border-gray-100 font-normal text-gray-600 flex items-start justify-start text-base'>
      <ul className='w-full'>
        {listItem.map((item, index) => (
          <>
            {
              item.divider && (
                <li className='flex items-center justify-center my-1'>
                  <Divider sx={{ width: "90%" }} />
                </li>
              )
            }
            <li key={index} className='px-4 py-1 flex gap-2 text-left hover:bg-gray-200'>
              {item.icon}
              {item.label}

            </li>

          </>
        ))}
      </ul>
    </div>
  );
};


export default function PopupMessage() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleIconClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsPopupVisible(!isPopupVisible);
  };

  const handleMenuClick = (itemId: string) => (event: React.MouseEvent) => {
    if (itemId !== 'category' && itemId !== 'mute' && itemId !== 'auto-delete') {
      setIsPopupVisible(false);
    }
  };

  const handleHoverMenu = (itemId: string) => (event: React.MouseEvent) => {
    if (itemId === 'category') {
      setOpenSubMenu(itemId)
    } else {
      setOpenSubMenu(itemId)
    }
  };


  return (
    <div className='absolute top-0 right-0'>
      <div onClick={handleIconClick} className='cursor-pointer'>
        <ListItemIcon>
          <MoreHorizIcon />
        </ListItemIcon>
      </div>
      {isPopupVisible && (
        <div id='popup-message' ref={popupRef} className='absolute top-0 bg-white z-50 shadow-md border border-gray-100 font-normal text-gray-600 flex w-max text-base'>
          <ul>
            {options.map((option, index) => (
              <React.Fragment key={index}>
                <li
                  onClick={handleMenuClick(option.itemId)}
                  onMouseEnter={handleHoverMenu(option.itemId)}
                  className='relative px-4 py-1 text-left hover:bg-gray-200'>
                  <div className='grid grid-flow-col gap-4'>
                    <div className='col-span-10'>

                      {option.label}
                    </div>
                    <div className='col-span-2 text-right'>{option.icon}</div>
                  </div>
                  {
                    openSubMenu === "category" && openSubMenu === option.itemId && (
                      <SubMenu listItem={classifyOptionCategory} />
                    )
                  }
                  {
                    openSubMenu === "mute" && openSubMenu === option.itemId && (
                      <SubMenu listItem={classifyOptionMute} />
                    )
                  }
                  {
                    openSubMenu === "auto-delete" && openSubMenu === option.itemId && (
                      <SubMenu listItem={classifyOptionAutoDelete} />
                    )
                  }
                </li>
                <li className='flex items-center justify-center my-1'>
                  {option.itemId === 'pin' && <Divider sx={{ width: "90%" }} />}
                  {option.itemId === 'unread' && <Divider sx={{ width: "90%" }} />}
                  {option.itemId === 'auto-delete' && <Divider sx={{ width: "90%" }} />}
                  {option.itemId === 'delete' && <Divider sx={{ width: "90%" }} />}
                </li>

              </React.Fragment>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}