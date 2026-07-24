import { motion, AnimatePresence } from 'framer-motion'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { RuleBadge } from '@/shared/components/AlertBadge'
import { RiskScoreGauge } from '@/shared/components/RiskScoreGauge'
import { AiExplanationField } from './AiExplanationField'
import { GeoMiniMap } from './GeoMiniMap'
import { ConfirmFraudButton } from '@/features/vector-feedback/ConfirmFraudButton'
import type { FlaggedTransaction } from '@/shared/types/transaction'
import { X, MapPin, DollarSign, User, Hash, Shield } from 'lucide-react'

interface AnalystDrawerProps {
  transaction: FlaggedTransaction | null
  onClose: () => void
}

export function AnalystDrawer({ transaction, onClose }: AnalystDrawerProps) {
  return (
    <Drawer open={!!transaction} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <AnimatePresence>
          {transaction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <DrawerHeader className="text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <DrawerTitle className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      {transaction.transactionId}
                    </DrawerTitle>
                    <DrawerDescription>
                      Flagged at {new Date(transaction.timestamp).toLocaleString()}
                    </DrawerDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </DrawerHeader>

              <div className="px-4 pb-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">User ID</span>
                      </div>
                      <p className="font-mono text-sm">{transaction.userId}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Amount</span>
                      </div>
                      <p className="font-semibold">${transaction.amount.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center gap-3">
                  <RuleBadge rule={transaction.reason} />
                  <RiskScoreGauge score={transaction.riskScore} size="md" />
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    AI Explanation
                  </h3>
                  <AiExplanationField
                    transactionId={transaction.id}
                    initialExplanation={transaction.aiExplanation}
                  />
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h3>
                  <GeoMiniMap location={transaction.location} />
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Metadata</h3>
                  <Card>
                    <CardContent className="p-4">
                      <pre className="text-xs text-muted-foreground overflow-x-auto">
                        {JSON.stringify(transaction.metadata, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-2">
                  <ConfirmFraudButton transactionId={transaction.id} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DrawerContent>
    </Drawer>
  )
}
