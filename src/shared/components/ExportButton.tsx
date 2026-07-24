import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { exportToCsv } from '@/shared/hooks/useCsvExport'

interface ExportButtonProps {
  data: unknown[]
  filename?: string
}

export function ExportButton({ data, filename = 'fraud-export' }: ExportButtonProps) {
  const handleExport = () => {
    exportToCsv(data, filename)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={!data || data.length === 0}>
      <Download className="w-4 h-4 mr-2" />
      Export CSV
    </Button>
  )
}
