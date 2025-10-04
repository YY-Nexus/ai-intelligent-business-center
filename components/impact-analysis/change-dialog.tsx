"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Edit } from "lucide-react"
import { ChangeForm } from "./change-form"
import type { Change } from "@/lib/models/impact-analysis-types"

interface ChangeDialogProps {
  change?: Change
  trigger?: React.ReactNode
  title?: string
  description?: string
  onSuccess?: (change: Change) => void
}

export function ChangeDialog({ change, trigger, title, description, onSuccess }: ChangeDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = (change: Change) => {
    setOpen(false)
    if (onSuccess) {
      onSuccess(change)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            {change ? (
              <>
                <Edit className="h-4 w-4 mr-2" />
                编辑变更
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                添加变更
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title || (change ? "编辑变更" : "添加变更")}</DialogTitle>
          <DialogDescription>{description || "填写以下信息以创建或更新API变更记录。"}</DialogDescription>
        </DialogHeader>
        <ChangeForm change={change} onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
