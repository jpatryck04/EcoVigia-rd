import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Cambiar la importación

// Extender jsPDF con autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ExportOptions {
  filename?: string;
  title?: string;
  includeAllData?: boolean;
}

interface ExportResult {
  success: boolean;
  message: string;
  filename?: string;
}

export class ExportService {
  private static instance: ExportService;

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  /**
   * Exportar voluntarios a Excel
   */
  exportVolunteersToExcel(
    volunteers: any[], 
    options: ExportOptions = {}
  ): ExportResult {
    try {
      const {
        filename = `voluntarios_${this.getCurrentDate()}.xlsx`,
        title = 'Listado de Voluntarios',
        includeAllData = false
      } = options;

      if (volunteers.length === 0) {
        return {
          success: false,
          message: 'No hay datos para exportar'
        };
      }

      // Preparar datos para Excel
      const data = volunteers.map((volunteer, index) => {
        // Normalizar voluntario
        const normalized = this.normalizeVolunteer(volunteer);
        
        const baseData = {
          '#': index + 1,
          'Nombre': normalized.nombre || '',
          'Cédula': normalized.cedula || '',
          'Email': normalized.email || '',
          'Teléfono': normalized.telefono || '',
          'Fecha Registro': this.formatDate(normalized.fecha_registro),
          'Estado': this.getStatusText(normalized.estado)
        };

        if (includeAllData) {
          return {
            ...baseData,
            'Fecha Aprobación': normalized.fecha_aprobacion ? 
              this.formatDate(normalized.fecha_aprobacion) : 'N/A',
            'Fecha Rechazo': normalized.fecha_rechazo ? 
              this.formatDate(normalized.fecha_rechazo) : 'N/A',
            'ID': normalized.id || ''
          };
        }

        return baseData;
      });

      // Crear workbook y worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);

      // Agregar título
      const titleRange = { s: { r: 0, c: 0 }, e: { r: 0, c: Object.keys(data[0] || {}).length - 1 } };
      ws['!merges'] = [titleRange];
      
      // Agregar encabezados
      XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: 'A1' });
      XLSX.utils.sheet_add_aoa(ws, [Object.keys(data[0] || {})], { origin: 'A2' });

      // Formatear celdas
      const wsRange = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
      for (let C = wsRange.s.c; C <= wsRange.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[address]) continue;
        ws[address].s = {
          font: { bold: true, sz: 14, color: { rgb: "1B5E20" } },
          alignment: { horizontal: "center" }
        };
      }

      // Formatear encabezados de columnas
      for (let C = wsRange.s.c; C <= wsRange.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 1, c: C });
        if (!ws[address]) continue;
        ws[address].s = {
          font: { bold: true, sz: 11 },
          fill: { fgColor: { rgb: "E8F5E8" } }
        };
      }

      // Ajustar ancho de columnas
      const colWidths = this.calculateColumnWidths(data);
      ws['!cols'] = colWidths;

      // Agregar metadata
      const metadata = [
        ['Generado por:', 'Sistema EcoVigía RD'],
        ['Fecha de exportación:', new Date().toLocaleDateString('es-DO')],
        ['Total de registros:', volunteers.length]
      ];

      const lastRow = wsRange.e.r + 3;
      XLSX.utils.sheet_add_aoa(ws, metadata, { origin: `A${lastRow}` });

      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Voluntarios');

      // Generar archivo
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      saveAs(blob, filename);
      
      console.log('✅ Excel exportado exitosamente:', filename);
      return {
        success: true,
        message: 'Archivo Excel generado exitosamente',
        filename
      };
      
    } catch (error) {
      console.error('❌ Error al exportar a Excel:', error);
      return {
        success: false,
        message: 'Error al generar el archivo Excel'
      };
    }
  }

  /**
   * Exportar voluntarios a PDF
   */
  exportVolunteersToPDF(
    volunteers: any[], 
    options: ExportOptions = {}
  ): ExportResult {
    try {
      const {
        filename = `voluntarios_${this.getCurrentDate()}.pdf`,
        title = 'Listado de Voluntarios'
      } = options;

      if (volunteers.length === 0) {
        return {
          success: false,
          message: 'No hay datos para exportar'
        };
      }

      // Normalizar voluntarios
      const normalizedVolunteers = volunteers.map(v => this.normalizeVolunteer(v));

      // Crear documento PDF
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Configuración del documento
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;

      // Título
      doc.setFontSize(16);
      doc.setTextColor(27, 94, 32);
      doc.setFont('helvetica', 'bold');
      doc.text(title, pageWidth / 2, 15, { align: 'center' });

      // Subtítulo
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generado el ${new Date().toLocaleDateString('es-DO')}`, pageWidth / 2, 22, { align: 'center' });

      // Logo
      this.addHeaderLogo(doc, pageWidth);

      // Preparar datos para la tabla
      const tableData = normalizedVolunteers.map((volunteer, index) => [
        (index + 1).toString(),
        volunteer.nombre || '',
        this.formatCedula(volunteer.cedula),
        volunteer.email || '',
        volunteer.telefono || '',
        this.formatDate(volunteer.fecha_registro),
        this.getStatusText(volunteer.estado)
      ]);

      const headers = [
        ['#', 'Nombre', 'Cédula', 'Email', 'Teléfono', 'Fecha Registro', 'Estado']
      ];

      // ✅ USAR autoTable directamente
      autoTable(doc, {
        head: headers,
        body: tableData,
        startY: 30,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 8,
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [27, 94, 32],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 40 },
          2: { cellWidth: 25 },
          3: { cellWidth: 45 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 20 }
        },
        didDrawPage: (data: any) => {
          const pageCount = doc.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(
            `Página ${data.pageNumber} de ${pageCount}`,
            pageWidth - margin,
            pageHeight - 5,
            { align: 'right' }
          );
        }
      });

      // Agregar estadísticas al final
      const finalY = (doc as any).lastAutoTable?.finalY || 100;
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`Total de voluntarios: ${normalizedVolunteers.length}`, margin, finalY + 10);
      
      const activeCount = normalizedVolunteers.filter(v => v.estado === 'activo').length;
      doc.text(`Voluntarios activos: ${activeCount}`, margin + 70, finalY + 10);
      
      const pendingCount = normalizedVolunteers.filter(v => v.estado === 'pendiente').length;
      doc.text(`Pendientes: ${pendingCount}`, margin + 140, finalY + 10);

      // Pie de página
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(
        'Sistema EcoVigía RD - Ministerio de Medio Ambiente y Recursos Naturales',
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );

      // Guardar PDF
      doc.save(filename);
      
      console.log('✅ PDF exportado exitosamente:', filename);
      return {
        success: true,
        message: 'Archivo PDF generado exitosamente',
        filename
      };
      
    } catch (error) {
      console.error('❌ Error al exportar a PDF:', error);
      return {
        success: false,
        message: 'Error al generar el archivo PDF'
      };
    }
  }

  /**
   * Exportar estadísticas a PDF (versión simplificada sin autoTable)
   */
  exportStatisticsToPDF(volunteers: any[]): ExportResult {
    try {
      if (volunteers.length === 0) {
        return {
          success: false,
          message: 'No hay datos para generar estadísticas'
        };
      }

      // Normalizar voluntarios
      const normalizedVolunteers = volunteers.map(v => this.normalizeVolunteer(v));

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Título
      doc.setFontSize(18);
      doc.setTextColor(27, 94, 32);
      doc.setFont('helvetica', 'bold');
      doc.text('Estadísticas de Voluntarios', pageWidth / 2, 20, { align: 'center' });
      
      // Fecha
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generado: ${new Date().toLocaleDateString('es-DO')}`, pageWidth / 2, 28, { align: 'center' });
      
      // Calcular estadísticas
      const total = normalizedVolunteers.length;
      const active = normalizedVolunteers.filter(v => v.estado === 'activo').length;
      const pending = normalizedVolunteers.filter(v => v.estado === 'pendiente').length;
      const inactive = normalizedVolunteers.filter(v => v.estado === 'inactivo').length;
      const rejected = normalizedVolunteers.filter(v => v.estado === 'rechazado').length;
      
      // Estadísticas en texto
      let yPos = 50;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Resumen de Voluntarios:', 20, yPos);
      
      yPos += 15;
      doc.setFontSize(10);
      doc.text(`• Total de voluntarios: ${total}`, 30, yPos);
      yPos += 7;
      doc.text(`• Voluntarios activos: ${active} (${((active / total) * 100).toFixed(1)}%)`, 30, yPos);
      yPos += 7;
      doc.text(`• Pendientes de aprobación: ${pending} (${((pending / total) * 100).toFixed(1)}%)`, 30, yPos);
      yPos += 7;
      doc.text(`• Voluntarios inactivos: ${inactive} (${((inactive / total) * 100).toFixed(1)}%)`, 30, yPos);
      yPos += 7;
      doc.text(`• Solicitudes rechazadas: ${rejected} (${((rejected / total) * 100).toFixed(1)}%)`, 30, yPos);
      
      // Gráfico de barras simple
      yPos += 20;
      this.drawSimpleChart(doc, active, pending, inactive, rejected, total, 20, yPos);
      
      const filename = `estadisticas_voluntarios_${this.getCurrentDate()}.pdf`;
      doc.save(filename);
      
      return {
        success: true,
        message: 'Estadísticas exportadas a PDF',
        filename
      };
      
    } catch (error) {
      console.error('Error al exportar estadísticas:', error);
      return {
        success: false,
        message: 'Error al exportar estadísticas'
      };
    }
  }

  /**
   * Exportar a CSV
   */
  exportToCSV(volunteers: any[], filename = 'voluntarios.csv'): ExportResult {
    try {
      if (volunteers.length === 0) {
        return {
          success: false,
          message: 'No hay datos para exportar'
        };
      }

      // Normalizar voluntarios
      const normalizedVolunteers = volunteers.map(v => this.normalizeVolunteer(v));

      const headers = ['Nombre', 'Cédula', 'Email', 'Teléfono', 'Fecha Registro', 'Estado'];
      const csvData = normalizedVolunteers.map(v => [
        v.nombre || '',
        v.cedula || '',
        v.email || '',
        v.telefono || '',
        this.formatDate(v.fecha_registro),
        this.getStatusText(v.estado)
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, filename);
      
      return {
        success: true,
        message: 'Archivo CSV generado',
        filename
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al generar CSV'
      };
    }
  }

  // Métodos auxiliares
  private normalizeVolunteer(volunteer: any): any {
    return {
      ...volunteer,
      nombre: volunteer.nombre || '',
      cedula: volunteer.cedula || '',
      email: volunteer.email || '',
      telefono: volunteer.telefono || '',
      fecha_registro: volunteer.fecha_registro || volunteer.created_at || volunteer.fechaSolicitud || new Date().toISOString(),
      fecha_aprobacion: volunteer.fecha_aprobacion || volunteer.fechaAprobacion,
      fecha_rechazo: volunteer.fecha_rechazo || volunteer.fechaRechazo,
      estado: volunteer.estado || volunteer.status || 'pendiente',
      id: volunteer.id || `vol-${Date.now()}`
    };
  }

  private getCurrentDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0].replace(/-/g, '');
  }

  private getStatusText(estado: string): string {
    const statusMap: Record<string, string> = {
      'activo': 'Activo',
      'pendiente': 'Pendiente',
      'inactivo': 'Inactivo',
      'rechazado': 'Rechazado'
    };
    return statusMap[estado] || estado;
  }

  private getStatusColor(estado: string): [number, number, number] {
    const colorMap: Record<string, [number, number, number]> = {
      'activo': [76, 175, 80],     // Verde
      'pendiente': [255, 152, 0],  // Naranja
      'inactivo': [158, 158, 158], // Gris
      'rechazado': [244, 67, 54]   // Rojo
    };
    return colorMap[estado] || [0, 0, 0];
  }

  private formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-DO');
    } catch {
      return 'Fecha inválida';
    }
  }

  private formatCedula(cedula: string): string {
    if (!cedula) return '';
    if (cedula.length === 11) {
      return cedula.replace(/(\d{3})(\d{7})(\d{1})/, '$1-$2-$3');
    }
    return cedula;
  }

  private calculateColumnWidths(data: any[]): { wpx: number }[] {
    if (!data.length) return [];
    
    const colWidths = Object.keys(data[0]).map(() => ({ wpx: 100 }));
    
    data.forEach(row => {
      Object.values(row).forEach((value, index) => {
        const length = String(value).length;
        if (length * 8 > colWidths[index].wpx) {
          colWidths[index].wpx = Math.min(length * 8, 200);
        }
      });
    });
    
    return colWidths;
  }

  private addHeaderLogo(doc: jsPDF, pageWidth: number): void {
    try {
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'italic');
      doc.text('Ministerio de Medio Ambiente y Recursos Naturales', pageWidth / 2, 8, { align: 'center' });
    } catch (error) {
      console.log('No se pudo agregar logo:', error);
    }
  }

  private drawSimpleChart(doc: jsPDF, active: number, pending: number, inactive: number, rejected: number, total: number, x: number, y: number): void {
    const barWidth = 20;
    const spacing = 25;
    const maxHeight = 50;
    
    // Calcular alturas
    const activeHeight = (active / total) * maxHeight;
    const pendingHeight = (pending / total) * maxHeight;
    const inactiveHeight = (inactive / total) * maxHeight;
    const rejectedHeight = (rejected / total) * maxHeight;
    
    // Dibujar barras
    doc.setFillColor(76, 175, 80);
    doc.rect(x, y + (maxHeight - activeHeight), barWidth, activeHeight, 'F');
    doc.text('Activos', x, y + maxHeight + 5);
    
    doc.setFillColor(255, 152, 0);
    doc.rect(x + spacing, y + (maxHeight - pendingHeight), barWidth, pendingHeight, 'F');
    doc.text('Pendientes', x + spacing, y + maxHeight + 5);
    
    doc.setFillColor(158, 158, 158);
    doc.rect(x + (spacing * 2), y + (maxHeight - inactiveHeight), barWidth, inactiveHeight, 'F');
    doc.text('Inactivos', x + (spacing * 2), y + maxHeight + 5);
    
    doc.setFillColor(244, 67, 54);
    doc.rect(x + (spacing * 3), y + (maxHeight - rejectedHeight), barWidth, rejectedHeight, 'F');
    doc.text('Rechazados', x + (spacing * 3), y + maxHeight + 5);
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}

export const exportService = ExportService.getInstance();