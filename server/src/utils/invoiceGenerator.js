import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoicePDF = async (order, restaurant) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const filename = `invoice_${order._id}.pdf`;
      const filepath = path.join(__dirname, "../../tmp", filename);

      if (!fs.existsSync(path.join(__dirname, "../../tmp"))) {
        fs.mkdirSync(path.join(__dirname, "../../tmp"), { recursive: true });
      }

      doc.pipe(fs.createWriteStream(filepath));

      doc.fontSize(20).text(restaurant.name, 100, 100);
      doc.fontSize(12).text(`Order ID: ${order._id}`, 100, 130);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      doc.text(`Table: ${order.tableNumber}`);
      doc.text(`Status: ${order.status}`);
      doc.moveDown();

      doc.fontSize(12).text("Items:", 100, 200);
      let yPos = 220;
      order.items.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.name} x${item.quantity} - Rs. ${item.price * item.quantity}`, 100, yPos);
        yPos += 20;
      });

      doc.moveDown();
      doc.fontSize(14).text(`Total: Rs. ${order.totalAmount}`, 100, yPos + 20);

      doc.end();
      resolve(filepath);
    } catch (error) {
      reject(error);
    }
  });
};
