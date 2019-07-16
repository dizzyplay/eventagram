import { useState } from "react";

export function usePage(initialPage, list, paging) {
  if (!paging) paging = 36;
  const [page, setPage] = useState(Number(initialPage - 1));
  let currentItems = list.slice(
    Number(page * paging),
    Number(paging + page * paging)
  );
  if (currentItems.length === 0) {
    currentItems = list.slice(0, list.length);
  }
  let allPage = Math.floor(list.length / paging);
  if (list.length % paging) allPage++;
  const handlePage = p => {
    setPage(p - 1);
  };
  return {
    currentPage: page,
    currentItems,
    allPage,
    handlePage
  };
}
