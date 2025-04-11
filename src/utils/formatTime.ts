
export const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
};

export function getHourAndMinute(isoString: string) {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format kết quả có thêm số 0 nếu cần
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}
