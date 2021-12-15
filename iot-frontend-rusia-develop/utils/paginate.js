export const totalPage = (count, size) => Math.ceil(count / size)
export const totalSkip = (page, size) => (page - 1) * size
