import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const renderEmail = async (templateName, data) => {
  const filePath = path.join(__dirname, "../emails", `${templateName}.ejs`);
  return await ejs.renderFile(filePath, data);
};
