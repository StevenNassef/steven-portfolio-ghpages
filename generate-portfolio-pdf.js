import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import https from 'https';

// Portfolio information
const portfolioUrl = 'https://www.stevennassef.com';
const portfolioDomain = 'www.stevennassef.com';

// Favicon URL
const faviconUrl = 'https://img.icons8.com/stickers/200/source-code.png';

// Profile photo path
const profilePhotoPath = path.join(process.cwd(), 'public', 'profile', 'profile.jpg');

// Function to download image from URL
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

// Main function to generate PDF
async function generatePDF() {
  // Download favicon
  let faviconBuffer = null;
  try {
    faviconBuffer = await downloadImage(faviconUrl);
  } catch (error) {
    console.warn('⚠️  Could not download favicon:', error.message);
  }
  // Create a new PDF document
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 80, bottom: 80, left: 80, right: 80 }
  });

  // Create the output file
  const outputPath = path.join(process.cwd(), 'portfolio-card.pdf');
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Color scheme matching portfolio (dark theme)
  const backgroundColor = '#0b0c10'; // Portfolio background
  const foregroundColor = '#e5e7eb'; // Portfolio foreground text
  const primaryColor = '#60a5fa'; // Portfolio primary blue
  const mutedColor = '#9ca3af'; // Portfolio muted text

  // Set background color
  doc.rect(0, 0, 595, 842)
     .fillColor(backgroundColor)
     .fill();

  // Add favicon to corners (subtle decorative element)
  if (faviconBuffer) {
    const faviconSize = 35;
    const cornerPadding = 25;

    // Top-left corner
    doc.image(faviconBuffer, cornerPadding, cornerPadding, {
      width: faviconSize,
      height: faviconSize,
      fit: [faviconSize, faviconSize]
    });

    // Top-right corner
    doc.image(faviconBuffer, 595 - cornerPadding - faviconSize, cornerPadding, {
      width: faviconSize,
      height: faviconSize,
      fit: [faviconSize, faviconSize]
    });

    // Bottom-left corner
    doc.image(faviconBuffer, cornerPadding, 842 - cornerPadding - faviconSize, {
      width: faviconSize,
      height: faviconSize,
      fit: [faviconSize, faviconSize]
    });

    // Bottom-right corner
    doc.image(faviconBuffer, 595 - cornerPadding - faviconSize, 842 - cornerPadding - faviconSize, {
      width: faviconSize,
      height: faviconSize,
      fit: [faviconSize, faviconSize]
    });
  }

  // Profile photo dimensions and position
  const photoSize = 120;
  const photoX = (595 - photoSize) / 2; // Centered horizontally
  const photoY = 120;

  // Check if profile photo exists, if not try .png
  let photoPath = profilePhotoPath;
  if (!fs.existsSync(photoPath)) {
    photoPath = path.join(process.cwd(), 'public', 'profile', 'profile.png');
  }

  // Draw circular photo with border
  if (fs.existsSync(photoPath)) {
    const centerX = photoX + photoSize / 2;
    const centerY = photoY + photoSize / 2;
    const radius = photoSize / 2;
    const borderWidth = 3;

    // Draw border circle
    doc.circle(centerX, centerY, radius + borderWidth)
       .fillColor('#1f2937')
       .fill();

    // Create circular clipping path for the image
    doc.save();
    doc.circle(centerX, centerY, radius)
       .clip();

    // Add the image (ensure it covers the circle area)
    doc.image(photoPath, photoX, photoY, {
      width: photoSize,
      height: photoSize,
      fit: [photoSize, photoSize],
      align: 'center',
      valign: 'center'
    });

    doc.restore();

    // Draw inner border circle for better definition
    doc.circle(centerX, centerY, radius)
       .lineWidth(2)
       .strokeColor('#1f2937')
       .stroke();
  }

  // Title (adjusted position below photo)
  doc.fillColor(foregroundColor)
     .fontSize(42)
     .font('Helvetica-Bold')
     .text('Steven Nassef Henry', 80, photoY + photoSize + 40, { align: 'center' });

  // Subtitle (adjusted position)
  doc.fillColor(mutedColor)
     .fontSize(20)
     .font('Helvetica')
     .text('Senior Game Engineer', 80, photoY + photoSize + 90, { align: 'center' });

  // Portfolio Link Section (adjusted position)
  let yPosition = photoY + photoSize + 170;

  doc.fillColor(primaryColor)
     .fontSize(20)
     .font('Helvetica-Bold')
     .text(portfolioDomain, 80, yPosition, { 
       link: portfolioUrl,
       underline: true,
       align: 'center'
     });

  // Finalize the PDF
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log('✅ PDF generated successfully!');
      console.log(`📄 File saved as: ${outputPath}`);
      console.log(`🌐 Portfolio URL: ${portfolioUrl}`);
      resolve(outputPath);
    });

    stream.on('error', (error) => {
      console.error('❌ Error generating PDF:', error);
      reject(error);
    });
  });
}

// Run the PDF generation
generatePDF()
  .then(() => {
    console.log('✅ PDF generation completed!');
  })
  .catch((error) => {
    console.error('Failed to generate PDF:', error);
    process.exit(1);
  });
