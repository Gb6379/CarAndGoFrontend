const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  try {
    console.log('🚀 Iniciando geração do PDF...');
    
    // Verificar se o arquivo HTML existe
    const htmlPath = path.join(__dirname, 'SYSTEM_SCREENS_DOCUMENTATION.html');
    if (!fs.existsSync(htmlPath)) {
      throw new Error('Arquivo HTML não encontrado: SYSTEM_SCREENS_DOCUMENTATION.html');
    }

    // Lançar o navegador
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Carregar o arquivo HTML
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Configurar o PDF
    const pdfOptions = {
      path: path.join(__dirname, 'CAR_AND_GO_SYSTEM_SCREENS.pdf'),
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin: 0 auto;">
          CAR AND GO - Documentação de Telas do Sistema
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin: 0 auto;">
          Página <span class="pageNumber"></span> de <span class="totalPages"></span>
        </div>
      `
    };
    
    // Gerar o PDF
    console.log('📄 Gerando PDF...');
    await page.pdf(pdfOptions);
    
    await browser.close();
    
    console.log('✅ PDF gerado com sucesso!');
    console.log('📁 Arquivo salvo em: CAR_AND_GO_SYSTEM_SCREENS.pdf');
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  generatePDF();
}

module.exports = generatePDF;
