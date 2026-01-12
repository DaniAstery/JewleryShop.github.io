export async function generateReceiptPDF(order) {
  const { PDFDocument, rgb } = await import("pdf-lib");

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const { customer, items, total } = order;

  const fontSize = 12;
  let yPosition = 750;

  page.drawText("Order Receipt", { x: 50, y: yPosition, size: 18, color: rgb(0, 0, 0) });
  yPosition -= 30;

  page.drawText(`Customer Name: ${customer.name}`, { x: 50, y: yPosition, size: fontSize });
  yPosition -= 20;
  page.drawText(`Customer Email: ${customer.email}`, { x: 50, y: yPosition, size: fontSize });
  yPosition -= 20;
  page.drawText(`Customer Address: ${customer.address}`, { x: 50, y: yPosition, size: fontSize });
  yPosition -= 30;

  page.drawText("Order Details:", { x: 50, y: yPosition, size: fontSize });
  yPosition -= 20;

  items.forEach((item, index) => {
    page.drawText(
      `${index + 1}. ${item.name} - $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`,
      { x: 50, y: yPosition, size: fontSize }
    );
    yPosition -= 20;
  });

  yPosition -= 10;
  page.drawText(`Total: $${total.toFixed(2)}`, { x: 50, y: yPosition, size: fontSize, color: rgb(0, 0, 1) });

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Order_Receipt_${Date.now()}.pdf`;
  link.click();
}