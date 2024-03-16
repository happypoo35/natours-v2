const useLocale = (args) => {
  let dateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...args?.options,
  };

  const localeDate = (date) =>
    new Date(date).toLocaleString(args?.format || "en-EN", dateOptions);

  return localeDate;
};

export default useLocale;
