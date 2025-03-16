/* eslint-disable @typescript-eslint/no-explicit-any */
export function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
export const handleSearch = (
  data: any[],
  typeSearch: string,
  keywords: string,
) => {
  if (keywords.length === 0) {
    return data;
  }
  const query = removeVietnameseTones(keywords?.toLowerCase());
  return data.filter((gr: any) => {
    const val = removeVietnameseTones(gr[`${typeSearch}`]?.toLowerCase());
    return val.includes(query);
  });
};
