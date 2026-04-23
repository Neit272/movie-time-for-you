const currentYear = new Date().getFullYear();

export const YEARS = [
    ...Array.from({ length: currentYear - 1999 }, (_, i) => {
        const year = (currentYear - i).toString();
        return { label: year, value: year };
    }),
    { label: 'Trước 2000', value: '1999' }
];

export const COMIC_STATUSES = [
    { label: 'Mới cập nhật', value: 'truyen-moi' },
    { label: 'Đang phát hành', value: 'dang-phat-hanh' },
    { label: 'Hoàn thành', value: 'hoan-thanh' },
    { label: 'Sắp ra mắt', value: 'sap-ra-mat' },
];
