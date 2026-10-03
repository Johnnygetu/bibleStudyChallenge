export function getReaderDisplayName(reader) {
  const fullName = [reader?.full_name, reader?.name, reader?.reader_name]
    .find((value) => typeof value === "string" && value.trim());

  if (fullName) return fullName.trim();

  const splitName = [reader?.first_name, reader?.last_name]
    .filter((value) => typeof value === "string" && value.trim())
    .join(" ")
    .trim();

  return splitName || "Unknown reader";
}
